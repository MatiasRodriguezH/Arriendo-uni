import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const {u,r} = req.query;

        let conn = await getConnection();
        const result = await conn.execute(`SELECT s.estado_solicitud, s.id_usuario, s.id_arriendo, i.id_arrendador,
            sol.nombre ||' '|| sol.apellido1 AS "SOLICITANTE", sol.imagen_perfil "SOLICITANTE_IMAGEN",
            arr.nombre ||' '|| arr.apellido1 AS "ARRENDADOR", arr.imagen_perfil AS "ARRENDADOR_IMAGEN",
            a.titulo AS "NOMBRE_ARRIENDO", a.tipo_arriendo AS "TIPO_ARRIENDO", i.num_banios, i.num_habitaciones,
            i.tipo_inmueble AS "TIPO_INMUEBLE", img.nombre_imagen AS "IMAGEN PORTADA",
            TO_CHAR(s.fecha_hora, 'DD-MM-YY hh:mm') AS "FECHA"
            FROM TCDB_SOLICITUD s
            JOIN TCDB_USUARIO sol ON (sol.id_usuario = s.id_usuario)
            JOIN TCDB_ARRIENDO a ON (a.id_arriendo = s.id_arriendo)
            JOIN TCDB_INMUEBLE i ON (i.id_inmueble = a.id_inmueble)
            JOIN TCDB_USUARIO arr ON (arr.id_usuario = i.id_arrendador)
            LEFT JOIN TCDB_IMAGEN_INMUEBLE img ON (img.id_inmueble = i.id_inmueble AND img.orden_imagen = 0)
            WHERE s.id_usuario = :p_id_usuario AND s.id_arriendo = :p_id_arriendo`,
            {p_id_usuario: u, p_id_arriendo: r},{outFormat: OUT_FORMAT_OBJECT});
        
        const data = result.rows[0];
        
        if (data.ESTADO_SOLICITUD == "aceptado" ){
            const contacto = await conn.execute(`SELECT 
                CASE WHEN i.origen_contacto = 'arrendador' THEN arr.telefono ELSE i.telefono_contacto END AS "TELEFONO_CONTACTO",
                CASE WHEN i.origen_contacto = 'arrendador' THEN arr.correo ELSE i.correo_contacto END AS "CORREO_CONTACTO",
                sol.telefono AS "TELEFONO_SOLICITANTE"
                FROM TCDB_ARRIENDO a
                JOIN TCDB_INMUEBLE i ON (i.id_inmueble = a.id_inmueble)
                JOIN TCDB_USUARIO arr ON (arr.id_usuario = i.id_arrendador)
                LEFT JOIN TCDB_USUARIO sol ON (sol.id_usuario = :p_id_solicitante)
                WHERE a.id_arriendo = :p_id_arriendo`,
                {p_id_arriendo: r, p_id_solicitante: u},{outFormat: OUT_FORMAT_OBJECT});
            data['TELEFONO_CONTACTO'] = contacto.rows[0].TELEFONO_CONTACTO;
            data['CORREO_CONTACTO'] = contacto.rows[0].CORREO_CONTACTO;
            data['TELEFONO_SOLICITANTE'] = contacto.rows[0].TELEFONO_SOLICITANTE;
        }
        if (conn) await conn.close();
        return res.json(data);
    }
    if (req.method == "PUT") {
        const {id_usuario, id_arriendo, respuesta } = req.body;

        let conn = await getConnection();

        await conn.execute(`BEGIN GESTOR_EDITAR_SOLICITUD(:p_id_usuario,:p_id_arrendador,:p_id_arriendo, :p_respuesta); END;`,
            {p_id_usuario: id_usuario, p_id_arrendador: null, p_id_arriendo: id_arriendo, p_respuesta: respuesta});

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
