import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {

        const {role} = req.query;
        //configurar conexion a BD
        let conn = await getConnection();
        try{
            if (role != 'all'){
                const data = await conn.execute(`SELECT * FROM TCDB_USUARIO WHERE rol_usuario = :p_role`,
                {p_role: role},{outFormat:OUT_FORMAT_OBJECT});
                if (conn) await conn.close();
                return res.json(data.rows);
            }
            else{
                const data = await conn.execute(`SELECT * FROM TCDB_USUARIO`,
                [],{outFormat:OUT_FORMAT_OBJECT});
                if (conn) await conn.close();
                return res.json(data.rows);
            }
        }
        catch (error) {
            return res.json({ error: error.message }, { status: 500 });
        }
    }
}