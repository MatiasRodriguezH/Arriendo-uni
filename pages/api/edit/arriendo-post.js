import fs from "fs";
import path from "path";
import formidable from "formidable";
import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat}  from "oracledb";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let conn = await getConnection();

  async function updateArriendo(data) {
    const updateResult = await conn.execute(
      `BEGIN 
        CRUD_ARRIENDO(
          'U', 
          :p_id_arriendo, 
          :p_tipo_arriendo, 
          :p_titulo, 
          :p_id_inmueble,
          :p_precio, 
          :p_descripcion, 
          :p_estado, 
          SYSDATE
        );
        CRUD_INMUEBLE(
          p_operacion   => 'U',
          p_id_arriendo => :p_id_arriendo,
          p_modalidad   => :p_modalidad
        ); 
      END;`,
      data
    );
  }

  async function insertHabitacion(data) {
    await conn.execute(`BEGIN CRUD_HABITACION('I', :p_id_habitacion, :p_id_arriendo, :p_nombre, :p_superficie, :p_descripcion,
       :p_precio, :p_imagen_portada); END;`,data);
  }

  async function updateHabitacion(data) {
    await conn.execute(
      `BEGIN 
        CRUD_HABITACION(
          'U', 
          :p_id_habitacion, 
          :p_id_arriendo, 
          :p_nombre, 
          :p_superficie, 
          :p_descripcion,
          :p_precio, 
          :p_imagen_portada
        ); 
      END;`,
      data
    );
  }


  const uploadDir = path.join(process.cwd(), "public", "images");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  // --- CONFIGURACIÓN CORRECTA DE FORMIDABLE ---
  const form = formidable({
    multiples: true,
    keepExtensions: true,
    uploadDir,
  });

  // Función que mueve/renombra imágenes dentro de /uploads
  function guardarImagen(file,name,dir) {
    if (!file || file.size === 0) return null;
    const ext = path.extname(file.originalFilename);
    const newName = `${name}_${Date.now()}${ext}`;
    const newPath = path.join(uploadDir,dir, newName);
    // Mover desde carpeta temporal de formidable
    fs.renameSync(file.filepath, newPath);
    // Retorna URL pública
    return dir + "/" + newName;
  }

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error procesando archivos" });

    const arriendo = JSON.parse(fields.arriendo || "{}");
    const habitaciones = JSON.parse(fields.habitaciones || "[]");

    console.log(arriendo);
    console.log(habitaciones);


    await updateArriendo({
      p_id_arriendo: arriendo.id_arriendo,
      p_tipo_arriendo: arriendo.tipo_arriendo,
      p_titulo: arriendo.titulo,
      p_id_inmueble: arriendo.id_inmueble,
      p_precio: arriendo.precio,
      p_descripcion: arriendo.descripcion,
      p_estado: "disponible",
      p_modalidad: arriendo.tipo_arriendo
    });

    if (arriendo.tipo_arriendo == "por habitaciones") {
      for (let i = 0; i < habitaciones.length; i++){
        const hab = habitaciones[i];
        const file = files[`imgHabitacion_${i}`];
        let imageUrl = hab.imagen_portada;  
 
        // Si hay un archivo enviado → guardar la nueva imagen
        if (file) {
          imageUrl = guardarImagen(file[0] || file, "room", "rooms");
        }

        if(hab.id){
          await updateHabitacion({
            p_id_habitacion: hab.id,
            p_id_arriendo: arriendo.id_arriendo,
            p_nombre: hab.nombre,
            p_superficie: hab.superficie,
            p_descripcion: hab.descripcion,
            p_precio: hab.precio,
            p_imagen_portada: imageUrl
          });
        }
        else{
          await insertHabitacion({
            p_id_habitacion: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
            p_id_arriendo: arriendo.id_arriendo,
            p_nombre: hab.nombre,
            p_superficie: hab.superficie,
            p_descripcion: hab.descripcion,
            p_precio: hab.precio,
            p_imagen_portada: imageUrl
          })
        }
      }
    }

    return res.json({mensaje:"datos actualizados"});
  });
}