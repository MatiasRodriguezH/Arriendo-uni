import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const {idUsuario, idArriendo} = req.query;

        let conn;

        try {
            conn = await getConnection();
            const result = await conn.execute(`SELECT tipo_interaccion FROM TCDB_INTERACCION WHERE id_usuario = :p_id_usuario AND id_arriendo = :p_id_arriendo`,
                {p_id_usuario: idUsuario, p_id_arriendo: idArriendo});
            return res.json(result.rows);
        } catch (error) {
            console.error("Error en apiInteraccion: ", error); 
            return res.status(500).json({error: "Error en interaccion GET"});
        } finally {
            if (conn) {
                try {
                    await conn.close();
                } catch (errorCon) {
                    console.error("Error cerrando conexion en apiInteractions: ", errorCon);
                }
            }
        }
    }
    if (req.method !== "POST") {
        const {idUsuario, idArriendo, interaccion} = req.body;

        let conn;

        try {
            conn = await getConnection();
            // Matt: Agregué un BEGIN en el PL/SQL
            await conn.execute(`BEGIN CRUD_INTERACION('I', :p_id_usuario, :p_id_arriendo, :p_tipo_interaccion, SYSDATE); END;`,
                {p_id_usuario: idUsuario, p_id_arriendo: idArriendo, p_tipo_interaccion: interaccion});
            
            return res.json({mensaje: "interacción ingresada"});
        } catch (error) {
            console.error("Error en apiInteraccion: ", error);
            return res.status(500).json({error: "Error en interaccion POST"});
        } finally {
            if (conn) {
                try {
                    await conn.close();
                } catch (errorCon) {
                    console.error("Error cerrando conexion en apiInteractions: ", errorCon);
                }
            }
        }
    }
}
