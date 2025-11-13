const oracledb = require('oracledb');

const dbConfig = {
  user: "DEV_USER",
  password: "Tucampus2025",
  connectString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.sa-santiago-1.oraclecloud.com))(connect_data=(service_name=g0dfcd02547afa1_tucampusdb_medium.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))"
};

export async function querydb(query, params = []) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows;
  } catch (err) {
    console.error("Error en consulta Oracle:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error al cerrar conexión:", err);
      }
    }
  }
}
