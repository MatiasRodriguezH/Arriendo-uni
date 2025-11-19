export const runtime = "nodejs";
import oracledb from 'oracledb';
import { getConnection } from '@/database/oracle';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let conn;

  try {
    conn = await getConnection();
    console.log("Successfully connected to Oracle Database");
    const result = await conn.execute("SELECT * FROM TCDB_REGION");
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
}


