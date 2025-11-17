export const runtime = "nodejs";
import dotenv from 'dotenv';
import oracledb from 'oracledb';

dotenv.config();
oracledb.initOracleClient({libDir:process.env.DB_LIBDIR, configDir: process.env.DB_CONFIGDIR});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const user = "ADMIN";
  const password = process.env.DB_PASSWORD;
  const connectString = process.env.DB_STRING;
  
  let connection;
  try {
    connection = await oracledb.getConnection({
      user,
      password,
      connectString
    });
    console.log("Successfully connected to Oracle Databas");
    const result = await connection.execute("select * from dual");
    return res.json("Query rows", result.rows);
  } catch (err) {
    console.error(err);
  } finally {
      if (connection){
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


