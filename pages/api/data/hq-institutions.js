import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

export default async function handler(req, res) {
  if (req.method == "GET") {
    
    const {id} = req.query;

    //configurar conexion a BD
    let conn = await getConnection();
    try{
      if (id == 'all'){
        const data = await conn.execute(`SELECT s.id_sede, s.id_institucion, INITCAP(s.nombre) as "NOMBRE", s.id_direccion, INITCAP(i.nombre) as "NOMBRE_INSTITUCION", d.calle, d.numero, c.nombre as "CIUDAD", r.id_region, r.nombre as "REGION"
          FROM TCDB_SEDE_INSTITUCION s 
          JOIN TCDB_INSTITUCION i ON (i.id_institucion = s.id_institucion)
          LEFT JOIN TCDB_DIRECCION d ON (d.id_direccion = s.id_direccion)
          LEFT JOIN TCDB_CIUDAD c ON (c.id_ciudad = d.id_ciudad)
          LEFT JOIN TCDB_REGION r ON (r.id_region = c.id_region)`,
        [],{outFormat:OUT_FORMAT_OBJECT});
        if (conn) await conn.close();
        return res.json(data.rows);
      }
      else{
        const data = await conn.execute(`SELECT id_sede, INITCAP(nombre) as "NOMBRE", id_direccion 
            FROM TCDB_SEDE_INSTITUCION WHERE id_institucion = :p_id_institucion`,
            {p_id_institucion: id},{outFormat:OUT_FORMAT_OBJECT});
        if (conn) await conn.close();
        return res.json(data.rows);
      }
    }
    catch (error) {
      if (conn) await conn.close();
      return res.json({ error: error.message }, { status: 500 });
    }
  }

  if (req.method == "PUT"){
    const {id} = req.query;
    const { nombre, institucion, calle, numero, ciudad, idRegion, idDireccion } = req.body;

    //configurar conexion a BD
    let conn = await getConnection();

    async function getCoords(direccion) {
      try{
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
        const response = await fetch(url);
        const coords = await response.json();

        if (coords.length === 0) {
          return {latitud: null, longitud: null}
        }
        return {
          latitud: parseFloat(coords[0].lat),
          longitud: parseFloat(coords[0].lon)
        }
      }
      catch (error){
        return {latitud: null, longitud: null};
      }
    }

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

    async function updateDireccion(data) {
      const insertResult = await conn.execute(`BEGIN CRUD_DIRECCION('U',:p_id_direccion, INITCAP(:p_calle), :p_numero, :p_id_ciudad, :p_latitud, :p_longitud); END;`,
        {
          p_id_direccion: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: Number(data.p_id_direccion) },
          p_calle: data.p_calle,
          p_numero: data.p_numero,
          p_id_ciudad: data.p_id_ciudad,
          p_latitud: data.p_latitud,
          p_longitud: data.p_longitud
        }
      );
    }

    try{
      const id_ciudad = await insertCiudad({
        p_nombre: ciudad,
        p_id_region : idRegion
      });

      const coordenadas = await getCoords(calle + " " + numero + "," + ciudad + " Chile");

      await updateDireccion({
        p_id_direccion: idDireccion,
        p_calle: calle,
        p_numero: numero,
        p_id_ciudad: id_ciudad,
        p_latitud: coordenadas.latitud,
        p_longitud: coordenadas.longitud
      });

      const resultUpdate = await conn.execute(
        `BEGIN CRUD_SEDE_INSTITUCION('U',:p_id_sede,:p_nombre,:p_id_institucion,:p_id_direccion);END;`,
        {
          p_id_sede: { val: Number(id), dir: oracledb.BIND_INOUT, type: oracledb.NUMBER },
          p_nombre: nombre,
          p_id_institucion: institucion,
          p_id_direccion: idDireccion,
        },
        { autoCommit: true }
      );
      if (conn) await conn.close();
      return res.status(200).json({ message: "Sede actualizada correctamente"});
    }
    catch (error) {
      if (conn) await conn.close();
      return res.json({ error: error.message }, { status: 500 });
    }

  }

  if (req.method == "POST"){
    const { nombre, institucion, calle, numero, ciudad, idRegion} = req.body;

    //configurar conexion a BD
    let conn = await getConnection();

    async function getCoords(direccion) {
      try{
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
        const response = await fetch(url);
        const coords = await response.json();

        if (coords.length === 0) {
          return {latitud: null, longitud: null}
        }
        return {
          latitud: parseFloat(coords[0].lat),
          longitud: parseFloat(coords[0].lon)
        }
      }
      catch (error){
        return {latitud: null, longitud: null};
      }
    }

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

    async function insertDireccion(data) {
      const insertResult = await conn.execute(`BEGIN CRUD_DIRECCION('I',:p_id_direccion, INITCAP(:p_calle), :p_numero, :p_id_ciudad, :p_latitud, :p_longitud); END;`,
        {
          p_id_direccion: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },
          p_calle: data.p_calle,
          p_numero: data.p_numero,
          p_id_ciudad: data.p_id_ciudad,
          p_latitud: data.p_latitud,
          p_longitud: data.p_longitud
        }
      );

      return insertResult.outBinds.p_id_direccion;
    }

    try{
      const id_ciudad = await insertCiudad({
        p_nombre: ciudad,
        p_id_region : idRegion
      });

      const coordenadas = await getCoords(calle + " " + numero + "," + ciudad + " Chile");

      const id_direccion = await insertDireccion({
        p_calle: calle,
        p_numero: numero,
        p_id_ciudad: id_ciudad,
        p_latitud: coordenadas.latitud,
        p_longitud: coordenadas.longitud
      });

      const resultUpdate = await conn.execute(
        `BEGIN CRUD_SEDE_INSTITUCION('I',:p_id_sede,:p_nombre,:p_id_institucion,:p_id_direccion);END;`,
        {
          p_id_sede: { val: null, dir: oracledb.BIND_INOUT, type: oracledb.NUMBER },
          p_nombre: nombre,
          p_id_institucion: institucion,
          p_id_direccion: id_direccion,
        },
        { autoCommit: true }
      );
      if (conn) await conn.close();
      return res.status(200).json({ message: "Sede ingresada correctamente"});
    }
    catch (error) {
      if (conn) await conn.close();
      return res.json({ error: error.message }, { status: 500 });
    }

  }
}