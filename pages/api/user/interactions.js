import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
    if (req.method == "GET") {
        const {u} = req.query;

        let conn = await getConnection();

        try {
            const result = await conn.execute(`SELECT a.id_arriendo, a.titulo, a.tipo_arriendo, i.tipo_inmueble,
                CASE WHEN img.nombre_imagen IS NULL THEN 'properties/example.jpg' ELSE img.nombre_imagen END AS "IMAGEN_PORTADA",
                d.calle||' '||d.numero||', '||c.nombre||', '||r.nombre AS "DIRECCION", TO_CHAR(int.fecha,'DD-MM-YY') AS "FECHA"
                FROM TCDB_INTERACCION int
                JOIN TCDB_ARRIENDO a ON a.id_arriendo = int.id_arriendo
                JOIN TCDB_INMUEBLE i ON i.id_inmueble = a.id_inmueble
                LEFT JOIN TCDB_IMAGEN_INMUEBLE img ON img.id_inmueble = i.id_inmueble AND img.orden_imagen = 0
                LEFT JOIN TCDB_DIRECCION d ON d.id_direccion = i.id_direccion
                LEFT JOIN TCDB_CIUDAD c ON c.id_ciudad = d.id_ciudad
                LEFT JOIN TCDB_REGION r ON r.id_region = c.id_region
                WHERE int.id_usuario = :p_id_usuario`,
                {p_id_usuario: u}, {outFormat: oracledb.OUT_FORMAT_OBJECT});
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
}
