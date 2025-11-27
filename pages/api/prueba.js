export const runtime = "nodejs";
import oracledb from 'oracledb';
import { getConnection } from '@/database/oracle';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let conn = await getConnection();

  try {
    console.log("Successfully connected to Oracle Database");
    const result = await conn.execute("SELECT * FROM TCDB_REGION");
    const response = await fetch("http://localhost:3000/api/registration",{
      method:"POST", 
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({prueba:"esta es una prueba"})
    });
    if(conn) await conn.close();
    return res.json(result.rows);
  } catch (err) {
    if(conn) await conn.close();
    console.error(err);
  }
}


