import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const {idUsuario, idArriendo} = req.query;

        let conn = getConnection();

        const result = await conn.execute(`SELECT * FROM TCDB_SOLICITUD WHERE id_usuario = :p_id_usuario AND id_arriendo = :p_id_arriendo`,
            {p_id_usuario: idUsuario, p_id_arriendo: idArriendo});

        if (conn) await conn.close();
        return res.json(result.rows);
    }
    if (req.method !== "POST") {
        const {idUsuario, idArriendo} = req.body;

        let conn = await getConnection();

        await conn.execute(`BEGIN CRUD_SOLICITUD('I', :p_id_usuario, :p_id_arriendo, :p_estado_solicitud, SYSDATE); END;`,
            {p_id_usuario: idUsuario, p_id_arriendo: idArriendo, p_estado_solicitud: 'en espera'});
        await conn.execute(`BEGIN SP_NOTIFICAR_SOLICITUD_CONTACTO(:p_id_notificacion, :p_id_usuario, :p_id_arriendo); END;`,
            {p_id_notificacion: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
             p_id_usuario: idUsuario, p_id_arriendo: idArriendo});
        
        if (conn) await conn.close();
        return res.json({mensaje: "solicitud ingresada"});
    }
}
