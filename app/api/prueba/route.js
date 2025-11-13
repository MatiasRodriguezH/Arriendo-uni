import { querydb } from '../lib/oracle';

const oracledb = require('oracledb');

export async function GET() {
  const dbConfig = {
  user: "DEV_USER",
  password: "Tucampus2025",
  connectString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.sa-santiago-1.oraclecloud.com))(connect_data=(service_name=g0dfcd02547afa1_tucampusdb_medium.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
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


