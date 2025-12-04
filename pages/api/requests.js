import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const {user, rental} = req.query;

        let conn = getConnection();

        const result = await conn.execute(`SELECT * FROM TCDB_SOLICITUD WHERE id_usuario = :p_id_usuario AND id_arriendo = :p_id_arriendo`,
            {p_id_usuario: user, p_id_arriendo: rental});

        if (conn) await conn.close();
        return res.json(result.rows);
    }
    if (req.method !== "POST") {
        const {user, rental} = req.body;

        let conn = await getConnection();

        await conn.execute(`BEGIN GESTOR_CREAR_SOLICITUD(:p_id_usuario, :p_id_arriendo); END;)`,
            {p_id_usuario: user, p_id_arriendo: rental});
        
        if (conn) await conn.close();
        return res.json({mensaje: "solicitud ingresada"});
    }
}
