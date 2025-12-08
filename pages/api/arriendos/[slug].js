import { getConnection } from '@/database/oracle';
import oracledb, { outFormat } from 'oracledb';

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

    const idArriendo = Number(slug);

    const result = await conn.execute(
      `SELECT a.id_arriendo, i.tipo_inmueble, a.tipo_arriendo, a.titulo, a.descripcion AS "DESCRIPCION_ARRIENDO", i.id_arrendador, arr.nombre ||' '|| arr.apellido1 AS "ARRENDADOR",
       i.id_inmueble, i.num_banios, i.num_habitaciones, i.propietario, TO_CHAR(DISTANCIA_KM(d.latitud, d.longitud, dsede.latitud, dsede.longitud),'FM9,999.99')||' Km' AS "DISTANCIA",
       inst.siglas||' - '||sede.nombre AS "SEDE_CERCANA", d.calle||' '||d.numero||' '||i.direccion_adicional||', '||c.nombre ||', '||r.nombre AS "DIRECCION", i.descripcion AS "DESCRIPCION_INMUEBLE"
       FROM TCDB_ARRIENDO a
       JOIN TCDB_INMUEBLE i ON i.id_inmueble = a.id_inmueble
       LEFT JOIN TCDB_SEDE_INSTITUCION sede ON sede.id_sede = i.sede_cercana
       LEFT JOIN TCDB_INSTITUCION inst ON inst.id_institucion = sede.id_institucion
       LEFT JOIN TCDB_DIRECCION dsede ON dsede.id_direccion = sede.id_direccion
       JOIN TCDB_USUARIO arr ON arr.id_usuario = i.id_arrendador
       LEFT JOIN TCDB_DIRECCION d ON d.id_direccion = i.id_direccion
       LEFT JOIN TCDB_CIUDAD c ON c.id_ciudad = d.id_ciudad
       LEFT JOIN TCDB_REGION r ON r.id_region = c.id_region
       WHERE a.id_arriendo = :p_id_arriendo`,
      {p_id_arriendo: idArriendo},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const data = result.rows[0];

    if(data){
      const precio_arriendo = await conn.execute(`SELECT 
         CASE WHEN a.tipo_arriendo = 'por habitaciones' THEN 
         TO_CHAR(MIN(h.precio),'FM$9,999,999')||' - '||TO_CHAR(MAX(h.precio), 'FM$9,999,999')
         ELSE TO_CHAR(a.precio,'FM$9,999,999') END AS precio
         FROM TCDB_ARRIENDO a
         LEFT JOIN TCDB_HABITACION h ON (h.id_arriendo = a.id_arriendo)
         WHERE a.id_arriendo = :p_id_arriendo
         GROUP BY a.id_arriendo, a.tipo_arriendo, a.precio`,
      {p_id_arriendo: idArriendo}, {outFormat:oracledb.OUT_FORMAT_OBJECT});
      data["PRECIO"] = precio_arriendo.rows[0].PRECIO;
    }

    if(data){
      const habitaciones = await conn.execute(`SELECT nombre, superficie, descripcion, TO_CHAR(precio,'FM$9,999,999') AS "PRECIO", imagen_portada
        FROM TCDB_HABITACION WHERE id_arriendo = :p_id_arriendo ORDER BY precio ASC`,
        {p_id_arriendo: idArriendo}, {outFormat: oracledb.OUT_FORMAT_OBJECT});
      data["HABITACIONES"] = habitaciones.rows
    }

    if(data){
      const images = await conn.execute(
      'SELECT nombre_imagen FROM TCDB_IMAGEN_INMUEBLE WHERE id_inmueble = :p_id_inmueble ORDER BY orden_imagen ASC',
      {p_id_inmueble: data.ID_INMUEBLE}, {outFormat: oracledb.OUT_FORMAT_OBJECT});
      data["IMAGENES"] = images.rows.map(img => img.NOMBRE_IMAGEN);
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  } finally {
    if (conn) try { await conn.close(); } catch (e) {}
  }
}