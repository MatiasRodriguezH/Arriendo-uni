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
  
    const hash = bcrypt.hashSync(dataUser.contrasenia ,10); 
  
    const json_usuario = JSON.stringify({
      rol: dataUser.rol,
      rut: dataUser.rut,
      nombre: dataUser.nombre,
      apellido1: dataUser.apellido1,
      apellido2: dataUser.apellido2,
      correo: dataUser.correo,
      contrasenia: hash,
      telefono: dataUser.telefono,
      fecha_nacimiento: dataUser.fecha_nacimiento,
      genero: dataUser.genero,
      id_sede_inst: dataUser.sede_institucion,
      ciudad: dataUser.ciudad,
      id_region: dataUser.id_region,
      imagen_perfil: 'profile_pictures/example.jpg'
    });

    const result = await conn.execute(`BEGIN GESTOR_CREAR_USUARIO(:p_json_usuario, :p_id_usuario); END;`,
      {p_json_usuario: json_usuario, p_id_usuario: {dir: oracledb.BIND_OUT, type: oracledb.NUMBER}}
    );

    const id_usuario = result.outBinds.p_id_usuario;
      
    const token = jwt.sign(
      {
      id: id_usuario,
      email: dataUser.correo
      },
      SECRET,
      {
      expiresIn: "24h" // expira en 10 horas
      }
    );
  
    return res.status(200).json({token});

  } catch (error) {
    if (error.errorNum == -20030){
      return res.status(410).json({ error: error.message });
    }
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
