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

  async function getCoords(direccion) {
    try{
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
      const response = await fetch(url);
      const coords = await response.json();

      if (coords.length === 0) {
        return {latitud: null, longitud: null}
      }
      return {
        latitud: parseFloat(coords[0].lat),
        longitud: parseFloat(coords[0].lon)
      }
    }
    catch (error){
      return {latitud: null, longitud: null};
    }
  }
  
  async function insertCiudad(data) {
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
  
  async function insertDireccion(data) {
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
    return insertResult.outBinds.p_id_direccion;
  }

  async function updateDireccion(data) {
    const result = await conn.execute('SELECT FN_EXIST_DIRECCION(:p_calle, :p_numero, :p_id_ciudad) AS "id" FROM DUAL',{
      p_calle: data.p_calle,
      p_numero: data.p_numero,
      p_id_ciudad: data.p_id_ciudad
    },{ outFormat: OUT_FORMAT_OBJECT });

    let id_direccion = result.rows[0].id;

    if (!id_direccion){
      const consult = await conn.execute(`SELECT COUNT(*) as "NUMERO" FROM TCDB_INMUEBLE WHERE id_direccion = :p_id_direccion`,
        {p_id_direccion: data.p_id_direccion},{outFormat:OUT_FORMAT_OBJECT});
      if (consult.rows[0].NUMERO <= 1){
        await conn.execute(`BEGIN CRUD_DIRECCION('U',:p_id_direccion, INITCAP(:p_calle), :p_numero, :p_id_ciudad, :p_latitud, :p_longitud); END;`,
          {
            p_id_direccion: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: Number(data.p_id_direccion) },
            p_calle: data.p_calle,
            p_numero: data.p_numero,
            p_id_ciudad: data.p_id_ciudad,
            p_latitud: data.p_latitud,
            p_longitud: data.p_longitud
          }
        );
        return data.p_id_direccion
      }
      else{
        id_direccion = await insertDireccion(data);
      }
    }
    return id_direccion;
  }

  async function updateInmueble(data) {
    const updateResult = await conn.execute(
      `BEGIN 
        CRUD_INMUEBLE('U', :p_id_inmueble, :p_tipo_inmueble, :p_modalidad , :p_nombre, :p_propietario, :p_id_arrendador, :p_descripcion,
        :p_num_habitaciones, :p_num_banios, :p_id_direccion, :p_direccion_adicional, :p_estado, :p_origen_contacto, :p_telefono_contacto, :p_correo_contacto); 
      END;`,
      data);
  }

  async function updateImagenPortada(data) {
    const consult = await conn.execute(`SELECT id_imagen, nombre_imagen FROM TCDB_IMAGEN_INMUEBLE WHERE orden_imagen = 0 AND id_inmueble = :p_id_inmueble`,
      {p_id_inmueble: data.p_id_inmueble}, {outFormat:OUT_FORMAT_OBJECT});
    const id_imagen = consult.rows[0].ID_IMAGEN;
    
    const filePath = path.join(process.cwd(), "public", "images", consult.rows[0].NOMBRE_IMAGEN);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // elimina el archivo
    }

    await conn.execute(`BEGIN CRUD_IMAGEN_INMUEBLE('U', :p_id_imagen, :p_id_inmueble, :p_orden_imagen, :p_nombre_imagen); END;`,
      {p_id_imagen: id_imagen, p_id_inmueble: data.p_id_inmueble, p_orden_imagen: 0, p_nombre_imagen: data.p_nombre_imagen});

  }

  async function comprobarImagenesDB(data){
    const result = await conn.execute(`SELECT i.id_imagen, i.nombre_imagen, (SELECT COUNT(*) FROM TCDB_IMAGEN_INMUEBLE t2 WHERE t2.nombre_imagen = i.nombre_imagen) AS "CANTIDAD"
    FROM TCDB_IMAGEN_INMUEBLE i WHERE i.id_inmueble = :p_id_inmueble AND i.orden_imagen > :p_limite`, data, {outFormat: OUT_FORMAT_OBJECT});
    const imagenes = result.rows;
    if(imagenes){
      for(let i = 0; i < imagenes.length; i++) {
        const img = imagenes[i];
        console.log(img.NOMBRE_IMAGEN,":",img.CANTIDAD);
        if (img.CANTIDAD == 1){
          const filePath = path.join(process.cwd(), "public", "images", img.NOMBRE_IMAGEN);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // elimina el archivo
          }
        }
        await conn.execute(`BEGIN CRUD_IMAGEN_INMUEBLE('D',:p_id_imagen); END;`,{p_id_imagen: img.ID_IMAGEN});
      }
    }
  }

  async function updateImagen(conn,data, existentes) {
    const consult = await conn.execute(`SELECT id_imagen, nombre_imagen FROM TCDB_IMAGEN_INMUEBLE WHERE orden_imagen = :p_orden_imagen AND id_inmueble = :p_id_inmueble`,
      {p_orden_imagen: data.p_orden_imagen ,p_id_inmueble: data.p_id_inmueble}, {outFormat:OUT_FORMAT_OBJECT});
    
    if(consult.rows[0]){
      const id_imagen = consult.rows[0].ID_IMAGEN;
      await conn.execute(`BEGIN CRUD_IMAGEN_INMUEBLE('U', :p_id_imagen, :p_id_inmueble, :p_orden_imagen, :p_nombre_imagen); END;`,
        {p_id_imagen: id_imagen, p_id_inmueble: data.p_id_inmueble, p_orden_imagen: data.p_orden_imagen, p_nombre_imagen: data.p_nombre_imagen});
      if (!existentes.includes(consult.rows[0].NOMBRE_IMAGEN)){
        const filePath = path.join(process.cwd(), "public", "images", img.NOMBRE_IMAGEN);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // elimina el archivo
        }
      } 
    }
    else{
      await conn.execute(`BEGIN CRUD_IMAGEN_INMUEBLE('I', :p_id_imagen, :p_id_inmueble, :p_orden_imagen, :p_nombre_imagen); END;`,
        {p_id_imagen: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
        p_id_inmueble: data.p_id_inmueble,
        p_orden_imagen: data.p_orden_imagen,
        p_nombre_imagen: data.p_nombre_imagen
      });
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

    console.log(inmueble);
    console.log(direccion);
    console.log(contacto);
    console.log(imgGaleria);
    console.log(files.nuevasImgGaleria);

    const id_ciudad = await insertCiudad({
        p_nombre :direccion.ciudad,
        p_id_region: direccion.region
    });

    const coordenadas = await getCoords(direccion.calle + " " + direccion.numero + "," + direccion.ciudad + " Chile");

    const id_direccion = await updateDireccion({
      p_id_direccion: direccion.id_direccion,
      p_calle: direccion.calle,
      p_numero: direccion.numero,
      p_id_ciudad: id_ciudad,
      p_longitud: coordenadas.latitud,
      p_longitud: coordenadas.longitud
    });

    await updateInmueble({
      p_id_inmueble: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: Number(inmueble.id_inmueble) },
      p_tipo_inmueble: inmueble.tipo_inmueble,
      p_modalidad: inmueble.modalidad,
      p_nombre: inmueble.nombre,
      p_propietario: inmueble.propietario, 
      p_id_arrendador: inmueble.id_arrendador, 
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
    
    if (files.imgPortada){
      const img_portada = guardarImagen(files.imgPortada,'property','properties');
      await updateImagenPortada({
        p_id_inmueble: inmueble.id_inmueble,
        p_nombre_imagen: img_portada
      });
    }

    let index = 1;
    if (imgGaleria){
      for (let i = 0; i < imgGaleria.length; i++){
        const img = imgGaleria[i];
        await updateImagen(conn, {p_id_inmueble: inmueble.id_inmueble, p_orden_imagen: i + 1, p_nombre_imagen: img}, imgGaleria);
        index += 1;
      }
    }

    if (files.nuevasImgGaleria){
      for (let i = 0; i < files.nuevasImgGaleria.length; i++) {
        const img = files.nuevasImgGaleria[i];
        const img_galeria = guardarImagen(img,'property','properties');
        await updateImagen(conn,{
          p_id_inmueble: inmueble.id_inmueble,
          p_orden_imagen: index,
          p_nombre_imagen: img_galeria
        }, imgGaleria);
        index += 1;
      }
    }

    await comprobarImagenesDB({p_id_inmueble: inmueble.id_inmueble, p_limite: index-1});

    if(conn) await conn.close();
    return res.json({mensaje:"datos actualizados"});
  });
}