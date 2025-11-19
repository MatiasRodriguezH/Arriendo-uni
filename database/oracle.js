export const runtime = "nodejs";
import dotenv from 'dotenv';
const oracledb = require('oracledb');

dotenv.config();
oracledb.initOracleClient({libDir:process.env.DB_LIBDIR, configDir: process.env.DB_CONFIGDIR});


let oraclePool;

export async function getPool() {
  if (!oraclePool) {
    oraclePool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_STRING,
      poolMin: 1,
      poolMax: 10,
      poolIncrement: 1
    });
  }
  return oraclePool;
}

export async function getConnection() {
  const pool = await getPool();
  return pool.getConnection();
}