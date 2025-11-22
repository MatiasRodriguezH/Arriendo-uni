import { getConnection } from '@/database/oracle';
import oracledb from 'oracledb';

function slugify(str = '') {
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'slug required' });

  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT a.id_arriendo, i.tipo_inmueble, a.tipo_arriendo, a.titulo, a.precio, i.num_habitaciones,
              i.num_banios, m.nombre_imagen AS nombre_imagen, d.calle || ' ' || d.numero AS direccion
       FROM TCDB_ARRIENDO a
       JOIN TCDB_INMUEBLE i ON i.id_inmueble = a.id_inmueble
       LEFT JOIN TCDB_DIRECCION d ON d.id_direccion = i.id_direccion
       LEFT JOIN TCDB_IMAGEN_INMUEBLE m ON (m.id_inmueble = i.id_inmueble AND m.orden_imagen = 0)`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rows = result && result.rows ? result.rows : [];
    const found = rows.find(r => slugify(r.TITULO || r.titulo) === slug);

    if (!found) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(found);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  } finally {
    if (conn) try { await conn.close(); } catch (e) {}
  }
}