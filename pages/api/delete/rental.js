import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat}  from "oracledb";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    if(req.method != "DELETE"){
        return res.status(405).json({ error: "Método no permitido" });
    }

    const {id} = req.query;
    let conn = await getConnection();
    
    const results = await conn.execute(`SELECT imagen_portada FROM TCDB_HABITACION WHERE id_arriendo = :p_id_arriendo`,{p_id_arriendo: id});
    for (let i= 0; i < results.rows.length; i++){
        const img = results.rows[i];
        if (img[0]){
            const filePath = path.join(process.cwd(), "public", "images", img[0]);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // elimina el archivo imagen asociado
            }
        }
    }
    await conn.execute(`BEGIN CRUD_ARRIENDO('D', :p_id_arriendo); END;`,{p_id_arriendo: id});
    if (conn) await conn.close();   
    return res.json({mensaje: "arriendo eliminado"});
}