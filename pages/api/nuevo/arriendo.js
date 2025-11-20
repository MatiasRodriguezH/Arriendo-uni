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

  //configurar conexion a BD
  let conn = await getConnection();

  async function insert_ciudad(data) {
    const result = await conn.execute(
      'SELECT FN_EXIST_CIUDAD(:p_nombre, :p_id_region) AS "id" FROM DUAL',data,{ outFormat: OUT_FORMAT_OBJECT });
    let id_ciudad = result.rows[0].id;

    if (!id_ciudad) {
      const insertResult = await conn.execute(`BEGIN CRUD_CIUDAD('I',:p_id_ciudad, INITCAP(:p_nombre), :p_id_region); END;`,
        {
          p_id_ciudad: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
          p_nombre: data.p_nombre,
          p_id_region: data.p_id_region
        }
      );

      id_ciudad = insertResult.outBinds.p_id_ciudad;
    }

    return id_ciudad;
  }

  async function insert_direccion(data) {
    const result = await conn.execute('SELECT FN_EXIST_DIRECCION(:p_calle, :p_numero, :p_id_ciudad) AS "id" FROM DUAL',data,{ outFormat: OUT_FORMAT_OBJECT });
    let id_direccion = result.rows[0].id;

    if (!id_direccion){
      const insertResult = await conn.execute(`BEGIN CRUD_DIRECCION('I',:p_id_direccion, INITCAP(:p_calle), :p_numero, :p_id_ciudad); END;`,
        {
          p_id_direccion: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
          p_calle: data.p_calle,
          p_numero: data.p_numero,
          p_id_ciudad: data.p_id_ciudad
        }
      );

      id_direccion = insertResult.outBinds.p_id_ciudad;
    }
    return id_direccion;
  }

  async function insert_inmueble(data){
      await conn.execute(`INSERT INTO INMUEBLE(tipo_inmueble,modalidad,nombre,propietario,id_arrendador,num_habitaciones,
        num_banios,id_direccion, direccion_adicional, estado, origen_contacto, telefono_contacto, correo_contacto)
        VALUES(:p_tipo_inmueble, :p_modalidad, :p_nombre, :p_propietario, :p_id_arrendador, :p_num_habitaciones, :p_num_banios,
        :p_id_direccion, :p_direccion_adicional, :p_estado, :p_origen_contacto, :p_telefono_contacto, :p_correo_contacto)`, data);
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


  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error procesando archivos" });

    // JSON recibidos dentro del formData
    const direccion = JSON.parse(fields.direccion || "{}");
    const arriendo = JSON.parse(fields.arriendo || "{}");
    const habitaciones = JSON.parse(fields.habitaciones || "[]");

    const id_ciudad = await insert_ciudad({
      p_nombre :direccion.ciudad,
      p_id_region: direccion.region
    });

    const id_direccion = await insert_direccion({
      p_calle:direccion.calle,
      p_numero:direccion.numero,
      p_id_ciudad:id_ciudad
    });

    const data_inmueble={
      p_tipo_inmueble:null,
      p_modalidad:null,
      p_nombre:null,
      p_propietario:null, 
      p_id_arrendador:null, 
      p_num_habitaciones:null, 
      p_num_banios:null,
      p_id_direccion:null, 
      p_direccion_adicional:null,
      p_estado:null, 
      p_origen_contacto:null,
      p_telefono_contacto:null, 
      p_correo_contacto:null
    }
    
    
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

    console.log(direccion);

    return res.status(200).json({
      mensaje: "Datos recibidos correctamente",
      direccion,
      arriendo,
      imagenes: {
        img_portada,
        img_inmueble,
        img_habitaciones: urlsHabitaciones
      }
    });
  });
}
