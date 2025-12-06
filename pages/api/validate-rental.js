import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT } from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const {r, u} = req.query;
        
        let conn = await getConnection();
        const result = await conn.execute(`SELECT COUNT(a.id_arriendo) AS "PERTENECE"
            FROM TCDB_ARRIENDO a
            JOIN TCDB_INMUEBLE i ON (i.id_inmueble = a.id_inmueble)
            WHERE a.id_arriendo = :p_id_arriendo
            AND i.id_arrendador = :p_id_usuario`,
            {p_id_arriendo: r, p_id_usuario: u},{outFormat: OUT_FORMAT_OBJECT});

        if (conn) await conn.close();

        if (result.rows[0].PERTENECE > 0) {
            return res.json({permitido: true});
        } else {
            return res.json({permitido: false});
        }
    }
}