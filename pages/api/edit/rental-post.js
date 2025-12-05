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

    const habs = [];

    if (arriendo.tipo_arriendo == "por habitaciones") {
      for (let i = 0; i < habitaciones.length; i++){
        const hab = habitaciones[i];
        const file = files[`imgHabitacion_${i}`];
        let imageUrl = hab.imagen_portada;  
        if (file) {
          if (imageUrl){
            const filePath = path.join(process.cwd(), "public", "images", imageUrl);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // elimina el archivo
            }
          }
          imageUrl = guardarImagen(file[0] || file, `room_${i+1}`, "rooms");
        }

        habs.push({
          id: hab.id,
          nombre: hab.nombre,
          superficie: hab.superficie,
          descripcion: hab.descripcion,
          precio: hab.precio,
          imagen_portada: imageUrl
        });
      }
    }

    const json_arriendo = JSON.stringify({
      id_arriendo: arriendo.id_arriendo,
      tipo_arriendo: arriendo.tipo_arriendo,
      titulo: arriendo.titulo,
      id_inmueble: arriendo.id_inmueble,
      precio: arriendo.precio,
      descripcion: arriendo.descripcion,
      estado: "disponible",
      habitaciones: habs
    });

    console.log(json_arriendo);
    await conn.execute(`BEGIN GESTOR_EDITAR_ARRIENDO(:p_json_arriendo); END;`,
      {p_json_arriendo: json_arriendo});

    if (conn) await conn.close();
    return res.json({mensaje:"datos actualizados"});
  });
}