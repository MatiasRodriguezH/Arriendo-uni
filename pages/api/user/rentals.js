import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {id} = req.query;

  let conn = await getConnection();
  try {
    const results = await conn.execute(`SELECT a.id_arriendo,i.tipo_inmueble,a.tipo_arriendo,a.titulo,i.nombre, m.nombre_imagen AS "IMAGEN_PORTADA"
      FROM TCDB_ARRIENDO a
      JOIN TCDB_INMUEBLE i ON(i.id_inmueble = a.id_inmueble)
      LEFT JOIN TCDB_IMAGEN_INMUEBLE m ON (m.id_inmueble = i.id_inmueble AND m.orden_imagen = 0)
      WHERE i.id_arrendador = :p_id_arrendador`,{p_id_arrendador: id}, {outFormat: OUT_FORMAT_OBJECT});
    if(conn) await conn.close();                                    
    return res.json(results.rows);

  } catch (error) {
    if(conn) await conn.close();  
    return res.json({ error: error.message }, { status: 500 });
  }
}