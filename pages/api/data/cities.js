import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        //configurar conexion a BD
        let conn = await getConnection();
        try{
            const data = await conn.execute(`SELECT c.id_ciudad, c.nombre, c.id_region, r.nombre as "REGION" FROM TCDB_CIUDAD c 
                LEFT JOIN TCDB_REGION r ON (r.id_region = c.id_region) ORDER BY id_ciudad ASC`,[],{outFormat:OUT_FORMAT_OBJECT});
            if (conn) await conn.close();
            return res.json(data.rows);
        }
        catch (error) {
            if (conn) await conn.close();
            return res.json({ error: error.message }, { status: 500 });
        }
    }
    if (req.method == "PUT"){
        const {id} = req.query;
        const data = req.body;
        let conn = await getConnection();
        
        try{
            await conn.execute(`BEGIN CRUD_CIUDAD('U',:p_id_ciudad,:p_nombre,:p_id_region); END;`,
            {p_id_ciudad: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: Number(id) },
            p_nombre: data.nombre,
            p_id_region: data.region});
            if (conn) await conn.close();
            return res.json({ mensaje: "ciudad actualizada"});
        }
        catch (error){
            if (conn) await conn.close();
            return res.json({ error: error.message }, { status: 500 });  
        }

    }
    if (req.method == "POST"){
        const data = req.body;
        let conn = await getConnection();
        
        try{
            await conn.execute(`BEGIN CRUD_CIUDAD('I',:p_id_ciudad,:p_nombre,:p_id_region); END;`,
            {p_id_ciudad: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
            p_nombre: data.nombre,
            p_id_region: data.region});
            if (conn) await conn.close();
            return res.json({ mensaje: "ciudad creada"});
        }
        catch (error){
            if (conn) await conn.close();
            return res.json({ error: error.message }, { status: 500 });  
        }
    }
    if (req.method == "DELETE") {
        const {id} = req.query;
        //configurar conexion a BD
        let conn = await getConnection();
        try {
            await conn.execute(`BEGIN CRUD_CIUDAD('D',:p_id_ciudad); END;`,
            {p_id_ciudad: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: Number(id) }});
            if (conn) await conn.close();
            return res.json({ mensaje: "ciudad eliminada"});}
        catch (error){
            if (conn) await conn.close();
            return res.json({ error: error.message }, { status: 500 });  
        }  
    }
}