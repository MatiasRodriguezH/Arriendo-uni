import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT } from "oracledb";
import oracledb from "oracledb";

export default async function handler(req, res) {
  const allowedReferer = 'http://localhost:3000';

  const referer = req.headers.referer;
  if (!referer || !referer.startsWith(allowedReferer)) {
    // return res.status(403).json({ message: 'Acceso prohibido.' });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // === Leer filtros ===
  const universidad = req.query.universidad || null;
  const inmueble = req.query.inmueble || null;
  const tipo = req.query.tipo || null;
  const precioMin = req.query.precioMin ? Number(req.query.precioMin) : null;
  const precioMax = req.query.precioMax ? Number(req.query.precioMax) : null;
  const distanciaMax = req.query.distanciaMax ? Number(req.query.distanciaMax) : null;

  let conn;

  try {
    conn = await getConnection();

    let results;

    // === 1. Obtener arriendos desde Oracle usando tus SP existentes ===
    if (universidad !== null) {
      results = await conn.execute(
        `
        BEGIN 
          SP_MOSTRAR_ARRIENDOS_POR_INSTITUCION(
            :id_sede, 
            :cursor
          ); 
        END;
        `,
        {
          id_sede: Number(universidad),
          cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
        },
        { outFormat: OUT_FORMAT_OBJECT }
      );

    } else {
      results = await conn.execute(
        `BEGIN SP_MOSTRAR_ARRIENDOS(:cursor); END;`,
        { cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT } },
        { outFormat: OUT_FORMAT_OBJECT }
      );
    }

    // Convertir cursor en arreglo JS
    let data = await results.outBinds.cursor.getRows();
    // === 2. Filtros aplicados en JavaScript ===
    if (tipo) {
      data = data.filter((item) =>
        item.TIPO_ARRIENDO?.toLowerCase() === tipo.toLowerCase()
      );
    }

    if (inmueble) {
      data = data.filter((item) => 
        item.TIPO_INMUEBLE?.toLowerCase() === inmueble.toLowerCase()
      );
    }

    if (precioMin !== null) {
      data = data.filter((item) =>
        parseInt(item.PRECIO.replace(/[$,]/g, ""), 10) >= precioMin
    );
    }

    if (precioMax !== null) {
      data = data.filter((item) => 
        parseInt(item.PRECIO.replace(/[$,]/g, ""), 10) <= precioMax
      );
    }

    if (distanciaMax !== null) {
      data = data.filter((item) =>
        Number(item.DISTANCIA_KM) <= distanciaMax
      );
    }

    return res.json(data);

  } catch (error) {
    console.error("Error al conectar a Oracle:", error);
    return res.status(500).json({ error: error.message });

  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}
