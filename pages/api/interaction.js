import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const {u, r} = req.query;

        let conn;

        try {
            conn = await getConnection();
            const result = await conn.execute(`SELECT * FROM TCDB_INTERACCION WHERE id_usuario = :p_id_usuario AND id_arriendo = :p_id_arriendo`,
                {p_id_usuario: u, p_id_arriendo: r});
            if( result.rows.length > 0){
                return res.json(result.rows[0]);
            }
            else{
                return res.json(null);
            }
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
    if (req.method == "POST") {
        const {id_usuario, id_arriendo, interaccion} = req.body;

        let conn;

        try {
            conn = await getConnection();
            await conn.execute(`BEGIN CRUD_INTERACCION('I', :p_id_usuario, :p_id_arriendo, :p_tipo_interaccion, SYSDATE - (3/24)); END;`,
                {p_id_usuario: id_usuario, p_id_arriendo: id_arriendo, p_tipo_interaccion: interaccion});
            
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
    if (req.method == "DELETE") {
        const {id_usuario, id_arriendo} = req.body;

        let conn;

        try {
            conn = await getConnection();
            await conn.execute(`BEGIN CRUD_INTERACCION('D', :p_id_usuario, :p_id_arriendo); END;`,
                {p_id_usuario: id_usuario, p_id_arriendo: id_arriendo});
            
            return res.json({mensaje: "interacción eliminada"});
        } catch (error) {
            console.error("Error en apiInteraccion: ", error);
            return res.status(500).json({error: "Error en interaccion DELETE"});
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
