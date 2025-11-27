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

  async function getArriendo(id){
    const result = await conn.execute(`SELECT a.*, i.nombre, i.num_banios, i.num_habitaciones, d.calle||' '||d.numero as "DIRECCION", img.nombre_imagen 
        FROM TCDB_ARRIENDO a 
        JOIN TCDB_INMUEBLE i ON i.id_inmueble = a.id_inmueble
        JOIN TCDB_DIRECCION d ON d.id_direccion = i.id_direccion
        LEFT JOIN TCDB_IMAGEN_INMUEBLE img ON img.id_inmueble = i.id_inmueble AND img.orden_imagen = 0
        WHERE a.id_arriendo = :p_id_arriendo`,{p_id_arriendo: id},{outFormat: OUT_FORMAT_OBJECT});
    const data = result.rows[0];
    return data;
  }
  async function getHabitaciones(id){
    const result = await conn.execute(`SELECT * FROM TCDB_HABITACION WHERE id_arriendo = :p_id_arriendo`,{p_id_arriendo: id},{outFormat: OUT_FORMAT_OBJECT});
    const data = result.rows;
    return data;
  }
  
  const arriendo = await getArriendo(id);
  const habitaciones = await getHabitaciones(id);
  arriendo["HABITACIONES"] = habitaciones;
  
  if (conn) await conn.close();
  return res.json(arriendo);
}