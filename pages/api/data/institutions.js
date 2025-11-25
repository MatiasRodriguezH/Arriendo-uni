import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

export default async function handler(req, res) {
  if (req.method == "GET") {
    //configurar conexion a BD
    let conn = await getConnection();
    try{
      const data = await conn.execute("SELECT * FROM TCDB_INSTITUCION",[],{outFormat:OUT_FORMAT_OBJECT});
      if (conn) await conn.close();
      return res.json(data.rows);
    }
    catch (error) {
      if (conn) await conn.close();
      return res.json({ error: error.message }, { status: 500 });
    }
  }
  if (req.method == "POST") {
    const data = req.body;
    let conn = await getConnection();

    await conn.execute("BEGIN CRUD_INSTITUCION('I',:p_id_institucion, :p_nombre, :p_tipo_institucion); END;",
      {p_id_institucion: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
       p_nombre: data.nombre,
       p_tipo_institucion: data.tipo_institucion
      }
    );
    if (conn) await conn.close();
    return res.status(200).json({mensaje: "ok"});
  }
}