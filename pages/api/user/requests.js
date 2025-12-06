import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const {user} = req.query;

        let conn = await getConnection();

        const consult = await conn.execute(`SELECT rol_usuario FROM TCDB_USUARIO WHERE id_usuario = :p_id_usuario`,
            {p_id_usuario: user},{outFormat: OUT_FORMAT_OBJECT});

        if (consult.rows[0].ROL_USUARIO == 'arrendador') {

            const result = await conn.execute(`SELECT s.id_usuario, s.id_arriendo, s.estado_solicitud, u.nombre ||' '|| u.apellido1 AS "SOLICITANTE",
                a.titulo AS "NOMBRE_ARRIENDO", TO_CHAR(s.fecha_hora, 'DD-MM-YY hh:mm') AS "FECHA"
                FROM TCDB_SOLICITUD s
                JOIN TCDB_USUARIO u ON (u.id_usuario = s.id_usuario)
                JOIN TCDB_ARRIENDO a ON (a.id_arriendo = s.id_arriendo)
                WHERE s.id_arriendo IN (SELECT ar.id_arriendo 
                                        FROM TCDB_ARRIENDO ar 
                                        JOIN TCDB_INMUEBLE i ON (i.id_inmueble = ar.id_inmueble)
                                        WHERE i.id_arrendador = :p_id_usuario)`,
                {p_id_usuario: user},{outFormat: OUT_FORMAT_OBJECT});

            if (conn) await conn.close();
            return res.json(result.rows);
        }
        if (consult.rows[0].ROL_USUARIO == 'estudiante') {
            const result = await conn.execute(`SELECT  s.id_usuario, s.id_arriendo, s.estado_solicitud, a.titulo AS "NOMBRE_ARRIENDO",
                a.tipo_arriendo, i.tipo_inmueble, TO_CHAR(s.fecha_hora, 'DD-MM-YY hh:mm') AS "FECHA"
                FROM TCDB_SOLICITUD s
                JOIN TCDB_ARRIENDO a ON (a.id_arriendo = s.id_arriendo)
                JOIN TCDB_INMUEBLE i ON (i.id_inmueble = a.id_inmueble)
                WHERE s.id_usuario = :p_id_usuario`,
                {p_id_usuario: user},{outFormat: OUT_FORMAT_OBJECT});

            if (conn) await conn.close();
            return res.json(result.rows);
        }

        if (conn) await conn.close();
            return res.status(401).json({mensaje:'no se pudo identificar el usuario'});
    }
    if (req.method == "PUT") {
        const {id_usuario, respuesta } = req.body;

        let conn = await getConnection();

        await conn.execute(`BEGIN GESTOR_EDITAR_SOLICITUD(:p_id_usuario,:p_id_arrendador,:p_id_arriendo, :p_respuesta); END;`,
            {p_id_usuario: null, p_id_arrendador: id_usuario, p_id_arriendo: null, p_respuesta: respuesta});

        if (conn) await conn.close();
        return res.json({mensaje: "solicitud ingresada"});
    }
    if (req.method == "POST") {
        const {id_usuario, id_arriendo } = req.body;

        let conn = await getConnection();

        await conn.execute(`BEGIN GESTOR_CREAR_SOLICITUD(:p_id_usuario, :p_id_arriendo); END;`,
            {p_id_usuario: id_usuario, p_id_arriendo: id_arriendo});
        
        if (conn) await conn.close();
        return res.json({mensaje: "solicitud ingresada"});
    }
}
