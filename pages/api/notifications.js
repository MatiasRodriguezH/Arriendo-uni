import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const {idUsuario} = req.query;

        let conn = getConnection();

        const result = await conn.execute(`SELECT tipo_notificacion, titulo, mensaje, estado, fecha_hora 
            FROM TCDB_NOTIFICACION WHERE id_usuario = :p_id_usuario GROUP BY titulo ORDER BY fecha_hora DESC`,
            {p_id_usuario: idUsuario});

        if (conn) await conn.close();
        return res.json(result.rows);
    }
}
