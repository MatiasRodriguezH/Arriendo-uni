import { getConnection } from "@/database/oracle";

export default async function handler(req, res) {
  
  const allowedReferer = 'http://localhost:3000'; // En producción: https://tu-dominio.com

  const referer = req.headers.referer;

  if (!referer || !referer.startsWith(allowedReferer)) {
    return res.status(403).json({ message: 'Acceso prohibido.' });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  let conn;
  try {
    conn = await getConnection();
    const results = await conn.execute(`
      SELECT i.id_inmueble,i.tipo_arriendo,i.nombre,m.nombre_imagen, d.calle||' '||d.numero 
      FROM TCDB_INMUEBLE i
      JOIN TCDB_IMAGES m ON (m.id_inmueble = i.id_inmueble)
      JOIN TCDB_DIRECCION d ON (d.id_direccion = i.id_direccion)
      WHERE m.orden_imagen = 0`);
      
    return res.json({results});

  } catch (error) {
    console.error("Error al conectar a Oracle:", error);
    return res.json({ error: error.message }, { status: 500 });
  }
}

