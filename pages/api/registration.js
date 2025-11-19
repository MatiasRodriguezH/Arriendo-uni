import { getConnection } from "@/database/oracle";

export default async function handler(req, res){
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }
  let conn;
  const body = await req.json();
  
  try{
    conn = await getConnection();
    const result = conn.execute(`BEGIN CRUD_USUARIO(:p_accion, 
        :p_id, 
        :p_nombre, 
        :p_apellido1,
        :p_apellido2,
        :p_correo,
        :p_contrasenia,
        :p_fecha_nac,
        :p_genero,
        :p_sede,
        :p_contacto,
        :p_ciudad,
        :p_resp ); END;`,
    {
        p_accion: 'INSERT',
        p_id: null,
        p_rol: body.rol,
        p_rut: body.rut,
        p_nombre: body.nombre,
        p_apellido1: body.apellido1,
        p_apellido2: body.apellido2,
        p_correo: body.correo,
        p_contrasenia:body.contrasenia,
        p_fecha_nac: body.fecha_nacimiento,
        p_genero:body.genero,
        p_sede:body.sede,
        p_contacto:body.contacto,
        p_ciudad:body.ciudad,
        p_resp: { dir: oracledb.BIND_OUT, type: oracledb.VARCHAR2 }
    });

    return res.json({ mensaje: result.outBinds.resp });

  }
  catch (error) {
    return res.json({ error: error.message }, { status: 500 });
  } finally {
    if (conn) await conn.close();
  }
  
}