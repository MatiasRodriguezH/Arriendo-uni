import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  let conn = await getConnection();
  try {
    const results = await conn.execute(`BEGIN SP_MOSTRAR_ARRIENDOS(:cursor); END;`,
      { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }}, {outFormat: OUT_FORMAT_OBJECT});

    const data = await results.outBinds.cursor.getRows(); 

    if(conn) await conn.close();
    return res.json(data);

  } catch (error) {
    console.error("Error al conectar a Oracle:", error);
    if(conn) await conn.close();
    return res.json({ error: error.message }, { status: 500 });
  }
}

