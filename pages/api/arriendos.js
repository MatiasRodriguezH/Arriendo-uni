import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  let conn;
  try {
    conn = await getConnection();
    const results = await conn.execute(`SELECT a.id_arriendo,i.tipo_inmueble,a.tipo_arriendo,a.titulo,TO_CHAR(a.precio, '$999,999') as "PRECIO", i.num_habitaciones,
                                         i.num_banios, m.nombre_imagen AS "IMAGEN_PORTADA", d.calle||' '||d.numero as "DIRECCION" 
                                        FROM TCDB_ARRIENDO a
                                        JOIN TCDB_INMUEBLE i ON(i.id_inmueble = a.id_inmueble)
                                        LEFT JOIN TCDB_DIRECCION d ON (d.id_direccion = i.id_direccion)
                                        LEFT JOIN TCDB_IMAGEN_INMUEBLE m ON (m.id_inmueble = i.id_inmueble AND m.orden_imagen = 0)`,[], {outFormat: OUT_FORMAT_OBJECT});
    return res.json(results.rows);

  } catch (error) {
    console.error("Error al conectar a Oracle:", error);
    return res.json({ error: error.message }, { status: 500 });
  }
}

