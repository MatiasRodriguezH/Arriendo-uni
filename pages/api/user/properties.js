import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {id} = req.query;

  let conn = await getConnection();
  try {
    const results = await conn.execute(`SELECT i.id_inmueble, i.tipo_inmueble, i.estado, i.nombre, d.calle||' '||d.numero||'\n'||c.nombre||', '||r.nombre as "DIRECCION", m.nombre_imagen AS "IMAGEN_PORTADA"
      FROM TCDB_INMUEBLE i
      JOIN TCDB_DIRECCION d ON (d.id_direccion = i.id_direccion)
      JOIN TCDB_CIUDAD c ON (c.id_ciudad = d.id_ciudad)
      JOIN TCDB_REGION r ON (r.id_region = c.id_region)
      LEFT JOIN TCDB_IMAGEN_INMUEBLE m ON (m.id_inmueble = i.id_inmueble AND m.orden_imagen = 0)
      WHERE i.id_arrendador = :p_id_arrendador`,{p_id_arrendador: id}, {outFormat: OUT_FORMAT_OBJECT});
    if(conn) await conn.close();                                    
    return res.json(results.rows);

  } catch (error) {
    if(conn) await conn.close();  
    return res.json({ error: error.message }, { status: 500 });
  }
}