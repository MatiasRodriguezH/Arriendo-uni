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
  console.log("User id:", user);

  //configurar conexion a BD
  let conn;
  try {
    conn = await getConnection();    
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
      const result = await conn.execute('SELECT FN_EXIST_DIRECCION(:p_calle, :p_numero, :p_id_ciudad) AS "id" FROM DUAL',{
        p_calle: data.p_calle,
        p_numero: data.p_numero,
        p_id_ciudad: data.p_id_ciudad
      },{ outFormat: OUT_FORMAT_OBJECT });
  
      let id_direccion = result.rows[0].id;
  
      if (!id_direccion){
        const insertResult = await conn.execute(`BEGIN CRUD_DIRECCION('I',:p_id_direccion, INITCAP(:p_calle), :p_numero, :p_id_ciudad, :p_latitud, :p_longitud); END;`,
          {
            p_id_direccion: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
            p_calle: data.p_calle,
            p_numero: data.p_numero,
            p_id_ciudad: data.p_id_ciudad,
            p_latitud: data.p_latitud,
            p_longitud: data.p_longitud
          }
        );
  
        id_direccion = insertResult.outBinds.p_id_direccion;
      }
      return id_direccion;
    }
  
    async function insert_inmueble(data){
      const insertResult = await conn.execute(`BEGIN CRUD_INMUEBLE('I', :p_id_inmueble, :p_tipo_inmueble, :p_modalidad, :p_nombre, :p_propietario, :p_id_arrendador,:p_descripcion,
        :p_num_habitaciones, :p_num_banios, :p_id_direccion, :p_direccion_adicional, :p_estado, :p_origen_contacto, :p_telefono_contacto, :p_correo_contacto); END;`, data);
      
      return insertResult.outBinds.p_id_inmueble;
    }
  
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
  
    async function insertImagen(data) {
      await conn.execute(`BEGIN CRUD_IMAGEN_INMUEBLE('I', :p_id_imagen, :p_id_inmueble, :p_orden_imagen, :p_nombre_imagen); END;`,data);
      
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

    var id_inmueble = null;
    console.log(inmuebleExistente);
    
    if(inmuebleExistente == "true"){
      id_inmueble = fields.id_inmueble[0];
      console.log(id_inmueble);
    }
    else{
      const id_ciudad = await insert_ciudad({
        p_nombre :direccion.ciudad,
        p_id_region: direccion.region
      });

      const id_direccion = await insert_direccion({
        p_calle:direccion.calle,
        p_numero:direccion.numero,
        p_id_ciudad:id_ciudad,
        p_latitud: ubicacion.lat,
        p_longitud: ubicacion.lng
      });

      if (contacto.origen_contacto == 'arrendador'){
        contacto.telefono = null;
        contacto.correo = null;
      } 

      id_inmueble = await insert_inmueble({
        p_id_inmueble: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
        p_tipo_inmueble: inmueble.tipo_inmueble,
        p_modalidad: inmueble.modalidad,
        p_nombre: inmueble.nombre,
        p_propietario: inmueble.propietario, 
        p_id_arrendador: Number(user), 
        p_descripcion: inmueble.descripcion,
        p_num_habitaciones: inmueble.num_habitaciones, 
        p_num_banios: inmueble.num_banios,
        p_id_direccion: id_direccion, 
        p_direccion_adicional: direccion.adicional,
        p_estado:'en arriendo', 
        p_origen_contacto:contacto.origen_contacto,
        p_telefono_contacto:contacto.telefono, 
        p_correo_contacto:contacto.correo
      });
      //guardar imagenes del inmueble
      const img_portada = guardarImagen(files.imgPortadaInmueble?.[0] || files.imgPortadaInmueble,'property','properties');
      insertImagen({
        p_id_imagen: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
        p_id_inmueble: id_inmueble,
        p_orden_imagen: 0,
        p_nombre_imagen: img_portada
      });
      if(files.imgInmueble){
        files.imgInmueble.map((img,i) => {
          const img_inmueble = guardarImagen(img,'property','properties');
          insertImagen({
            p_id_imagen: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
            p_id_inmueble: id_inmueble,
            p_orden_imagen: i+1,
            p_nombre_imagen: img_inmueble
          });
        });
      }
    }

    const id_arriendo = await insert_arriendo({
        p_id_arriendo: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
        p_tipo_arriendo: arriendo.tipo_arriendo,
        p_titulo: arriendo.titulo,
        p_id_inmueble: id_inmueble,
        p_precio: arriendo.precio,
        p_descripcion: arriendo.descripcion,
        p_estado: 'disponible'
    });

    if (arriendo.tipo_arriendo == "por habitaciones"){
      habitaciones.map((hab, i) => {
        const file = files[`imgHabitacion_${i}`];
        const imageUrl = guardarImagen(file?.[0] || file,'room','rooms');

        insert_habitacion({
          p_id_habitacion: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
          p_id_arriendo: id_arriendo,
          p_nombre: hab.nombre,
          p_superficie: hab.superficie,
          p_descripcion: hab.descripcion,
          p_precio: hab.precio,
          p_imagen_portada: imageUrl
        })
      });
    };

    console.log(inmuebleExistente);
    console.log(direccion);
    console.log(contacto);
    console.log(inmueble);
    console.log(arriendo);
    console.log(habitaciones);

    
  
  
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
