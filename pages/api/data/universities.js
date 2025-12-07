import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const { region } = req.query;

    if (!region) {
      return res.status(400).json({ error: "Falta el parámetro 'region' en la solicitud." });
    }

    let conn = await getConnection();
    try {
      const data = await conn.execute(`
        SELECT
          s.id_sede AS ID_UNIVERSIDAD,
          i.siglas || ' - ' || s.nombre AS NOMBRE
        FROM TCDB_INSTITUCION i 
        JOIN TCDB_SEDE_INSTITUCION s ON (i.id_institucion = s.id_institucion)
        JOIN TCDB_DIRECCION d ON (s.id_direccion = d.id_direccion)
        JOIN TCDB_CIUDAD c ON (d.id_ciudad = c.id_ciudad)
        JOIN TCDB_REGION r ON (c.id_region = r.id_region)
        WHERE r.nombre = :p_region
        ORDER BY i.id_institucion ASC
      `,
        { p_region: region },
        { outFormat: OUT_FORMAT_OBJECT }
      );
      if (conn) await conn.close();

      if (data.rows.length === 0) {
        return res.status(404).json({ mensaje: `No se encontraron universidades en la región: ${region}` });
      }

      return res.status(200).json(data.rows);
    } catch (error) {
      console.error("Error al obtener universidades por región:", error);
      if (conn) await conn.close();
      return res.status(500).json({ error: "Error interno del servidor al consultar la base de datos." });
    }
  }
}