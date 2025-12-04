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

  const { user } = req.query; 
  if (!user || isNaN(user)) {
    return res.status(500).json({ error: "error en credenciales"})
  }

  //configurar conexion a BD
  let conn;
  try {
    conn = await getConnection();    
  
    async function insert_arriendo(data) {
      const insertResult = await conn.execute(`BEGIN CRUD_ARRIENDO('I', :p_id_arriendo, :p_tipo_arriendo, :p_titulo, :p_id_inmueble,
         :p_precio, :p_descripcion, :p_estado, SYSDATE); END;`,data);
  
      return insertResult.outBinds.p_id_arriendo;
    }
    //form.parse
    async function insert_habitacion(data) {
      await conn.execute(`BEGIN CRUD_HABITACION('I', :p_id_habitacion, :p_id_arriendo, :p_nombre, :p_superficie, :p_descripcion,
         :p_precio, :p_imagen_portada); END;`,data);
    }
  
    // Carpeta donde se guardarán las imágenes
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

    // El form.parse tenia problemas de concurrencia, asi que lo hice promesa
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });
    
    // JSON recibidos dentro del formData
    const inmuebleExistente = fields.usarExistente[0];
    const direccion = JSON.parse(fields.direccion || "{}");
    const contacto = JSON.parse(fields.contacto|| "{}");
    const inmueble = JSON.parse(fields.nuevoInmueble || "{}");
    const arriendo = JSON.parse(fields.arriendo || "{}");
    const habitaciones = JSON.parse(fields.habitaciones || "[]");
    const ubicacion = JSON.parse(fields.ubicacion || "{}");

    let id_inmueble;

    if (inmuebleExistente == 'false'){
      if (contacto.origen_contacto == 'arrendador'){
        contacto.telefono = null;
        contacto.correo = null;
      } 

      //guardar imagenes del inmueble

      const imagenes = [];
      const img_portada = guardarImagen(files.imgPortadaInmueble?.[0] || files.imgPortadaInmueble,'property','properties');
      imagenes.push({orden:0, ruta: img_portada});

      if(files.imgInmueble){
        files.imgInmueble.map((img,i) => {
          const img_inmueble = guardarImagen(img,'property','properties');
          imagenes.push({orden:i+1, ruta: img_inmueble});
        });
      }

      //crear json del inmueble
      const json_inmueble = JSON.stringify({
        ciudad :direccion.ciudad,
        id_region: direccion.region,
        calle:direccion.calle,
        numero:direccion.numero,
        latitud: ubicacion.lat,
        longitud: ubicacion.lng,
        adicional: direccion.adicional,
        origen_contacto: contacto.origen_contacto,
        telefono_contacto: contacto.telefono, 
        correo_contacto: contacto.correo,
        tipo_inmueble: inmueble.tipo_inmueble,
        modalidad: inmueble.modalidad,
        nombre: inmueble.nombre,
        propietario: inmueble.propietario, 
        id_arrendador: user, 
        descripcion: inmueble.descripcion,
        num_habitaciones: inmueble.num_habitaciones, 
        num_banios: inmueble.num_banios,
        estado: "en arriendo",
        imagenes: imagenes
      });
    
      const result = await conn.execute(`BEGIN GESTOR_CREAR_INMUEBLE(:p_json_inmueble, :p_id_inmueble); END;`,
        {p_json_inmueble: json_inmueble, p_id_inmueble: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}}
      );

      id_inmueble = result.outBinds.p_id_inmueble;
    }
    else{
      id_inmueble = fields.id_inmueble[0];
    }

    const habs = [];

    if (arriendo.tipo_arriendo == "por habitaciones"){
      habitaciones.map((hab, i) => {
        const file = files[`imgHabitacion_${i}`];
        const imageUrl = guardarImagen(file?.[0] || file,'room','rooms');

        habs.push({
          nombre: hab.nombre,
          superficie: hab.superficie,
          descripcion: hab.descripcion,
          precio: hab.precio,
          imagen_portada: imageUrl
        })
      });
    };

    const json_arriendo = JSON.stringify({
        tipo_arriendo: arriendo.tipo_arriendo,
        titulo: arriendo.titulo,
        precio: arriendo.precio,
        descripcion: arriendo.descripcion,
        estado: 'disponible',
        habitaciones: habs
    });

    const result = await conn.execute(`BEGIN GESTOR_CREAR_ARRIENDO(:p_id_inmueble, :p_json_arriendo, :p_id_arriendo); END;`,
      {p_id_inmueble: id_inmueble, p_json_arriendo: json_arriendo, p_id_arriendo: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}}
    );

    return res.status(200).json({
      mensaje: "Datos recibidos correctamente",
    });

  } catch (error){
    console.error("Error conectando con DB en apiArriendo: ", error);
  } finally {
    if(conn) {
      try {
        await conn.close();
      } catch (closeError) {
        console.error("Error cerrando conexion en apiArriendo: ", closeError);
      }
    }
  }
}
