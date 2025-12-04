import fs from "fs";
import path from "path";
import formidable from "formidable";
import { getConnection } from "@/database/oracle";
import oracledb, { autoCommit, NUMBER } from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat}  from "oracledb";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let conn = await getConnection();
  
  async function comprobarImagenes(id, existentes){
    const result = await conn.execute(`SELECT nombre_imagen FROM TCDB_IMAGEN_INMUEBLE WHERE id_inmueble = :p_id_inmueble`,
       {p_id_inmueble: id}, {outFormat: OUT_FORMAT_OBJECT});
    const imagenes = result.rows;
    if(imagenes){
      for(let i = 0; i < imagenes.length; i++) {
        const img = imagenes[i];
        if (!existentes.includes(img.NOMBRE_IMAGEN) && img.NOMBRE_IMAGEN != null){
          const filePath = path.join(process.cwd(), "public", "images", img.NOMBRE_IMAGEN);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // elimina el archivo
          }
        }
      } 
    }
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

    const inmueble = JSON.parse(fields.inmueble || "{}");
    const direccion = JSON.parse(fields.direccion || "{}");
    const contacto = JSON.parse(fields.contacto|| "{}");
    const imgGaleria = JSON.parse(fields.imgGaleria|| "[]");

    const imagenes = [];
    const existentes = [];

    if (files.imgPortada){
      const img_portada = guardarImagen(files.imgPortada[0],'property_0','properties');
      imagenes.push({ id: inmueble.id_inmueble, orden: 0, ruta: img_portada });
    }
    else{
      const img_portada = JSON.parse(fields.imgPortadaOg|| "{}");
      imagenes.push({ id: img_portada.ID_IMAGEN, orden: 0, ruta: img_portada.NOMBRE_IMAGEN });
      existentes.push(img_portada.NOMBRE_IMAGEN);
    }

    let index = 1;
    if (imgGaleria){
      for (let i = 0; i < imgGaleria.length; i++){
        const img = imgGaleria[i];
        imagenes.push({id: img.ID_IMAGEN, orden: index, ruta: img.NOMBRE_IMAGEN})
        existentes.push(img.NOMBRE_IMAGEN);
        index += 1;
      }
    }

    if (files.nuevasImgGaleria){
      for (let i = 0; i < files.nuevasImgGaleria.length; i++) {
        const img = files.nuevasImgGaleria[i];
        const img_galeria = guardarImagen(img,`property_${index}`,'properties');
        imagenes.push({ orden: index, ruta: img_galeria });
        index += 1;
      }
    }

    await comprobarImagenes(inmueble.id_inmueble, existentes);

    const json_inmueble = JSON.stringify({
      id_inmueble: inmueble.id_inmueble,
      tipo_inmueble: inmueble.tipo_inmueble,
      modalidad: inmueble.modalidad,
      nombre: inmueble.nombre,
      propietario: inmueble.propietario, 
      id_arrendador: inmueble.id_arrendador, 
      descripcion: inmueble.descripcion,
      num_habitaciones: inmueble.num_habitaciones, 
      num_banios: inmueble.num_banios,
      id_direccion: direccion.id_direccion, 
      adicional: direccion.adicional,
      estado:'en arriendo', 
      origen_contacto:contacto.origen_contacto,
      telefono_contacto:contacto.telefono, 
      correo_contacto:contacto.correo,
      imagenes: imagenes
    });
    
    await conn.execute(`BEGIN GESTOR_EDITAR_INMUEBLE(:p_json_inmueble); END;`, 
      {p_json_inmueble: json_inmueble});

    if(conn) await conn.close();
    return res.json({mensaje:"datos actualizados"});
  });
}