import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat}  from "oracledb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  const { id } = req.query
  //conexion a BD
  let conn = await getConnection();

  async function getInmueble(id){
    const result = await conn.execute(`SELECT i.*, d.calle, d.numero, c.nombre as "CIUDAD", c.id_region 
        FROM TCDB_INMUEBLE i 
        JOIN TCDB_DIRECCION d ON d.id_direccion = i.id_direccion
        JOIN TCDB_CIUDAD c ON c.id_ciudad = d.id_ciudad
        WHERE i.id_inmueble = :p_id_inmueble`,{p_id_inmueble: id},{outFormat: OUT_FORMAT_OBJECT});
    const data = result.rows[0];
    return data;
  }
  async function getImagenes(id){
    const result = await conn.execute(`SELECT orden_imagen, nombre_imagen FROM TCDB_IMAGEN_INMUEBLE WHERE id_inmueble = :p_id_inmueble`,{p_id_inmueble: id},{outFormat: OUT_FORMAT_OBJECT});
    const data = result.rows;
    return data;
  }
  async function getArriendoHabitaciones(id){
    const result = await conn.execute(`SELECT COUNT(h.id_habitacion) as "NUM_HABITACIONES_ARRIENDO"
         FROM TCDB_ARRIENDO a LEFT JOIN TCDB_HABITACION h ON h.id_arriendo = a.id_arriendo
          WHERE a.id_inmueble = :p_id_inmueble`,{p_id_inmueble: id},{outFormat: OUT_FORMAT_OBJECT});
    const data = result.rows[0].NUM_HABITACIONES_ARRIENDO;
    return data;
  }
  
  const inmueble = await getInmueble(id);
  const imagenes = await getImagenes(id);
  const num_habitaciones = await getArriendoHabitaciones(id);
  inmueble["IMAGENES"] = imagenes;
  inmueble["NUM_HABITACIONES_ARRIENDO"] = num_habitaciones;
  
  if (conn) await conn.close();
  return res.json(inmueble);
}