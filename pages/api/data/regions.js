import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  //configurar conexion a BD
  let conn = await getConnection();
  try{
    const data = await conn.execute("SELECT * FROM TCDB_REGION",[],{outFormat:OUT_FORMAT_OBJECT});
    if (conn) await conn.close();
    return res.json(data.rows);
  }
  catch (error) {
    if (conn) await conn.close();
    return res.json({ error: error.message }, { status: 500 });
  }
}