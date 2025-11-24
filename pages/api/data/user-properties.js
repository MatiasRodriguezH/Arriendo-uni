import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {id} = req.query;

  //configurar conexion a BD
  let conn = await getConnection();
  try{
    const data = await conn.execute(`SELECT i.id_inmueble, i.nombre, d.calle ||' '|| d.numero as "DIRECCION", i.estado, i.num_habitaciones
        FROM TCDB_INMUEBLE i LEFT JOIN TCDB_DIRECCION d ON (d.id_direccion = i.id_direccion)
        WHERE i.id_arrendador = :p_id_arrendador AND i.estado != 'en arriendo'`,
        {p_id_arrendador: id},{outFormat:OUT_FORMAT_OBJECT});
    return res.json(data.rows);
  }
  catch (error) {
    return res.json({ error: error.message }, { status: 500 });
  }
}