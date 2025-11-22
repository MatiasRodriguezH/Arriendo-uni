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
    const data = await conn.execute(`SELECT id_sede, INITCAP(nombre) as "NOMBRE", id_direccion 
        FROM TCDB_SEDE_INSTITUCION WHERE id_institucion = :p_id_institucion`,
        {p_id_institucion: id},{outFormat:OUT_FORMAT_OBJECT});
    return res.json(data.rows);
  }
  catch (error) {
    return res.json({ error: error.message }, { status: 500 });
  }
}