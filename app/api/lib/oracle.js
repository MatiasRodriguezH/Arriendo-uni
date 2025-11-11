import oracledb from 'oracledb';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Configura la conexión
const dbConfig = {
  user: process.env.ORACLE_USER || 'dev_user',
  password: process.env.ORACLE_PASSWORD || 'ici2025',
  connectString: process.env.ORACLE_CONNECT || 'localhost/xe', // ejemplo Oracle XE
};

// Función genérica para ejecutar queries
export async function querydb(query, params = []) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(query, params);
    return result.rows;
  } catch (err) {
    console.error('Error en consulta Oracle:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error al cerrar conexión:', err);
      }
    }
  }
}
