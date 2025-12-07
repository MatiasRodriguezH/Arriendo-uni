import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";
import oracledb from "oracledb"
import { getConnection } from "@/database/oracle";

const SECRET = "tctoken";

async function getAuthUserData(id, email) {
    let conn = await getConnection();

    const result = await conn.execute(`SELECT u.id_usuario, u.rol_usuario, u.rut, u.correo, u.nombre, u.apellido1, u.apellido2,
        u.telefono, TO_CHAR(u.fecha_nacimiento, 'DD-MM-YYYY') AS "FECHA_NACIMIENTO", TRUNC(MONTHS_BETWEEN(SYSDATE, u.fecha_nacimiento)/12) AS "EDAD",
        INITCAP(u.genero) as "GENERO", i.id_institucion, i.nombre as "INSTITUCION", si.id_sede,u.id_ciudad, c.nombre AS "CIUDAD", c.id_region
        FROM TCDB_USUARIO u 
        LEFT JOIN TCDB_SEDE_INSTITUCION si ON (si.id_sede = u.id_sede_institucion)
        LEFT JOIN TCDB_INSTITUCION i ON (i.id_institucion = si.id_institucion)
        LEFT JOIN TCDB_CIUDAD c ON (c.id_ciudad = u.id_ciudad)
        WHERE u.id_usuario = :p_id AND u.correo = :p_correo`,
        {p_id: id, p_correo: email}, {outFormat: OUT_FORMAT_OBJECT});
    if (conn) await conn.close();
    return result.rows;
}

async function getUserData(id) {
    let conn = await getConnection();

    const result = await conn.execute(`SELECT u.rol_usuario, u.rut, u.correo, u.nombre, u.apellido1, u.apellido2,
        TO_CHAR(u.fecha_nacimiento, 'DD-MM-YYYY') AS "FECHA_NACIMIENTO", TRUNC(MONTHS_BETWEEN(SYSDATE, u.fecha_nacimiento)/12) AS "EDAD",
        INITCAP(u.genero) as "GENERO", i.nombre as "INSTITUCION", c.nombre AS "CIUDAD", r.nombre as "REGION"
        FROM TCDB_USUARIO u 
        LEFT JOIN TCDB_SEDE_INSTITUCION si ON (si.id_sede = u.id_sede_institucion)
        LEFT JOIN TCDB_INSTITUCION i ON (i.id_institucion = si.id_institucion)
        LEFT JOIN TCDB_CIUDAD c ON (c.id_ciudad = u.id_ciudad)
        LEFT JOIN TCDB_REGION r ON (r.id_region = c.id_region)
        WHERE u.id_usuario = :p_id`,
        {p_id: id}, {outFormat: OUT_FORMAT_OBJECT});
    if (conn) await conn.close();
    return result.rows[0];
}

export default async function handler(req, res) {
    if (req.method == "GET"){
        const {id} = req.query;
        try {
            const userData = await getUserData(id);
            return res.json(userData);
        } catch (error) {
           return res.status(401).json({ message: error });
        }
    }

    if (req.method == "POST") {
        const header = req.headers["authorization"];
        if (!header) return res.status(401).json({ error: "No token" });
        const token = header.split(" ")[1];

        try {
            const decoded = jwt.verify(token, SECRET);

            const userData = await getAuthUserData(decoded.id, decoded.email);
            return res.status(200).json(userData);

        } catch (error) {
            console.log("Token inválido o expirado");
            return res.status(401).json({ message: "Token inválido o expirado" });
        }
    }

    if (req.method == "PUT") {
        const form = req.body;

        console.log(form);

        let hash = null;
        if(form.contrasenia){
            hash = bcrypt.hashSync(form.contrasenia, 10); 
        }
        
        let conn = await getConnection();

        async function insertCiudad(data) {
            const result = await conn.execute(
            'SELECT FN_EXIST_CIUDAD(:p_nombre, :p_id_region) AS "id" FROM DUAL',data,{ outFormat: OUT_FORMAT_OBJECT });
            let id_ciudad = result.rows[0].id;
        
            if (!id_ciudad) {
            const insertResult = await conn.execute(`BEGIN CRUD_CIUDAD('I',:p_id_ciudad, INITCAP(:p_nombre), :p_id_region); END;`,
                {
                p_id_ciudad: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
                p_nombre: data.p_nombre,
                p_id_region: data.p_id_region
                }
            );
        
            await conn.commit();
            id_ciudad = insertResult.outBinds.p_id_ciudad;
            }
        
            return id_ciudad;
        }

        const id_ciudad = await insertCiudad({p_nombre: form.ciudad, p_id_region: form.region});
    
        await conn.execute(`BEGIN CRUD_USUARIO('U',:p_id_usuario, null, :p_rut, :p_nombre, :p_apellido1, :p_apellido2,
             null, :p_constrasenia, :p_telefono, null, null, :p_id_sede_institucion, :p_id_ciudad, :p_imagen_perfil); END;`,
            {p_id_usuario: form.id,
             p_rut: form.rut,
             p_nombre: form.nombre,
             p_apellido1: form.apellido1,
             p_apellido2: form.apellido2,
             p_constrasenia: hash,
             p_telefono: form.telefono,
             p_id_sede_institucion: form.sede,
             p_id_ciudad: id_ciudad,
             p_imagen_perfil: null})

        if(conn) await conn.close();
        return res.json({mensaje:"usuario actualizado"});
    }
}
