import { getConnection } from "@/database/oracle";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

const SECRET = "tctoken";

export default async function handler(req, res){
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const dataUser = req.body;

  let conn;

  try {

    let conn = await getConnection();
  
    function convertirFecha(fecha) {
      const [dia, mes, anio] = fecha.split("/");
      return `${anio}-${mes}-${dia}`;  // formato correcto para Oracle
    }
  
    async function verificarDuplicado(data) {
      const result = await conn.execute(`SELECT COUNT(*) as "RESULT" FROM TCDB_USUARIO WHERE (correo = :p_correo) OR (rut = :p_rut)`,data,
        {outFormat: OUT_FORMAT_OBJECT});
      
      if (result.rows[0].RESULT > 0){
        return true;
      }
      return false;
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
  
    async function insertUsuario(data) {
      const resultInsert = await conn.execute(`BEGIN CRUD_USUARIO('I', 
        :p_id_usuario,        
        :p_rol_usuario,
        :p_rut,
        :p_nombre,
        :p_apellido1,
        :p_apellido2,
        :p_correo,
        :p_contrasenia,
        :p_telefono,
        :p_fecha_nacimiento,
        :p_genero,
        :p_id_sede_inst,
        :p_id_ciudad,
        :p_imagen_perfil); END;`, data);
      
      await conn.commit();
      const id_usuario = resultInsert.outBinds.p_id_usuario;
      return id_usuario;
    }
  
    
    if( await verificarDuplicado({p_correo : dataUser.correo, p_rut: dataUser.rut}) ){
      return res.status(410).json({error:"correo o rut ya fueron usados"});
    }
    const hash = bcrypt.hashSync(dataUser.contrasenia ,10); 
    console.log(hash);
    
    let id_ciudad = null;
    if (dataUser.rol == "arrendador"){
      id_ciudad = await insertCiudad({
        p_nombre: dataUser.ciudad,
        p_id_region: dataUser.id_region
      })
    }
  
    const id_usuario = await insertUsuario({
        p_id_usuario: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: null },      
        p_rol_usuario: dataUser.rol,
        p_rut: dataUser.rut,
        p_nombre: dataUser.nombre,
        p_apellido1: dataUser.apellido1,
        p_apellido2: dataUser.apellido2,
        p_correo: dataUser.correo,
        p_contrasenia: hash,
        p_telefono: dataUser.telefono,
        p_fecha_nacimiento: {val: new Date(convertirFecha(dataUser.fecha_nacimiento)), type: oracledb.DATE},
        p_genero: dataUser.genero,
        p_id_sede_inst: dataUser.sede_institucion,
        p_id_ciudad: id_ciudad,
        p_imagen_perfil: 'profile_pictures/example.jpg'
      });
      
    const token = jwt.sign(
      {
      id: id_usuario,
      email: dataUser.correo
      },
      SECRET,
      {
      expiresIn: "10h" // expira en 10 horas
      }
    );
  
    if(conn) await conn.console();
    return res.status(200).json({token});
  } catch (error) {
    console.error("API error:", error);
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
