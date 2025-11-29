import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const {idUsuario, idArriendo} = req.query;

        let conn = getConnection();

        const result = await conn.execute(`SELECT tipo_interaccion FROM TCDB_INTERACCION WHERE id_usuario = :p_id_usuario AND id_arriendo = :p_id_arriendo`,
            {p_id_usuario: idUsuario, p_id_arriendo: idArriendo});

        if (conn) await conn.close();
        return res.json(result.rows);
    }
    if (req.method !== "POST") {
        const {idUsuario, idArriendo, interaccion} = req.body;

        let conn = await getConnection();

        await conn.execute(`CRUD_INTERACION('I', :p_id_usuario, :p_id_arriendo, :p_tipo_interaccion, SYSDATE); END;`,
            {p_id_usuario: idUsuario, p_id_arriendo: idArriendo, p_tipo_arriendo: interaccion});
        
        if (conn) await conn.close();
        return res.json({mensaje: "interacción ingresada"});
    }
}
