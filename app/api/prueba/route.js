import { querydb } from '../lib/oracle';

const oracledb = require('oracledb');

export async function GET() {
  const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTSTRING
  };
  try {
    let connection;
    connection = await oracledb.getConnection(dbConfig);
    const result = await querydb("SELECT * FROM TCDB_REGION");
    return Response.json({ mensaje: result});

  } catch (error) {
    console.error("❌ Error al conectar a Oracle:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}


