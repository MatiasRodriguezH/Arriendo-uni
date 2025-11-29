import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
  const allowedReferer = 'http://localhost:3000'; // En producción: https://tu-dominio.com

  const referer = req.headers.referer;

  if (!referer || !referer.startsWith(allowedReferer)) {
    return res.status(403).json({ message: 'Acceso prohibido.' });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const universidad = req.query.universidad?.trim() || null;

  let conn = await getConnection();

  try {
    // Ejecutar el SP existente
    const results = await conn.execute(
      `BEGIN SP_MOSTRAR_ARRIENDOS(:cursor); END;`,
      { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
      { outFormat: OUT_FORMAT_OBJECT }
    );

    const data = await results.outBinds.cursor.getRows(); 
    return res.json(data);

  } catch (error) {
    console.error("Error al conectar a Oracle:", error);
    return res.json({ error: error.message }, { status: 500 });
  }
}
