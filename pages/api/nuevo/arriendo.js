import fs from "fs";
import path from "path";
import formidable from "formidable";
import { getConnection } from "@/database/oracle";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let conn = await getConnection();

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

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error procesando archivos" });

    // JSON recibidos dentro del formData
    const inmueble = JSON.parse(fields.inmueble || "{}");
    const arriendo = JSON.parse(fields.arriendo || "{}");
    const habitaciones = JSON.parse(fields.habitaciones || "[]");

    const result = conn.execute(`INSERT INTO INMUEBLE(tipo_inmueble,modalidad,nombre,propietario,id_arrendador,num_habitaciones,num_banios)`);
    
    // Función que mueve/renombra imágenes dentro de /uploads
    function guardarImagen(file,dir) {
      if (!file || file.size === 0) return null;
      const newName = Date.now() + "_" + file.originalFilename;
      const newPath = path.join(uploadDir,dir, newName);
      // Mover desde carpeta temporal de formidable
      fs.renameSync(file.filepath, newPath);
      // Retorna URL pública
      return "/uploads/" + newName;
    }

    // Guardar imágenes principales
    const img_portada = guardarImagen(files.imgPortadaInmueble?.[0] || files.imgPortadaInmueble);
    const img_inmueble = guardarImagen(files.imgInmueble?.[0] || files.imgInmueble);

    // Guardar imágenes por habitación
    const urlsHabitaciones = habitaciones.map((_, i) => {
      const file = files[`imgHabitacion_${i}`];
      return guardarImagen(file?.[0] || file);
    });

    return res.status(200).json({
      mensaje: "Datos recibidos correctamente",
      inmueble,
      arriendo,
      imagenes: {
        img_portada,
        img_inmueble,
        img_habitaciones: urlsHabitaciones
      }
    });
  });
}
