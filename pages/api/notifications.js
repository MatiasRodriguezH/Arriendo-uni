import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const {id} = req.query;

        let conn = await getConnection();

        const result = await conn.execute(`SELECT id_notificacion, id_usuario,titulo, mensaje, TO_CHAR(fecha_hora, 'DD-MM-YY  hh:mm') as "FECHA", estado, enlace 
            FROM TCDB_NOTIFICACION WHERE id_usuario = :p_id_usuario ORDER BY fecha_hora DESC`,
            {p_id_usuario: id},{outFormat: OUT_FORMAT_OBJECT});

        if (conn) await conn.close();
        return res.json(result.rows);
    }
    if (req.method == "PUT") {
        const {id} = req.body;

        let conn = await getConnection();

        await conn.execute(`BEGIN CRUD_NOTIFICACION(p_operacion => 'U', p_id_notificacion => :p_id_notificacion, p_estado => 'leido'); END;`,
            {p_id_notificacion: id});

        if (conn) await conn.close();
        return res.status(200).json({message: "Notificación actualizada"});
    } 
}
