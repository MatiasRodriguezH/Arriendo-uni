import jwt from "jsonwebtoken";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";
import { getConnection } from "@/database/oracle";

const SECRET = "tctoken";

async function getUserData(id, email) {
    let conn;

    try{
        conn = await getConnection();

        const result = await conn.execute(`SELECT u.id_usuario, u.rol_usuario, u.rut, u.correo, u.nombre, u.apellido1, u.apellido2,
            u.telefono, u.fecha_nacimiento, u.genero, i.id_institucion as "INSTITUCION", si.id_sede AS "SEDE",u.id_ciudad
            FROM TCDB_USUARIO u 
            LEFT JOIN TCDB_SEDE_INSTITUCION si ON (si.id_sede = u.id_sede_institucion)
            LEFT JOIN TCDB_INSTITUCION i ON (i.id_institucion = si.id_institucion)
            WHERE u.id_usuario = :p_id AND u.correo = :p_correo`,
            {p_id: id, p_correo: email}, {outFormat: OUT_FORMAT_OBJECT});
        if (conn) await conn.close();
        return result.rows;
    } catch (error) {
        console.error("Error en GetUserData, apiProfile:", error);
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (closeError) {
                console.error("Error cerrando conexión en apiProfile: ", closeError)
            }
        }
    }
}

export default async function handler(req, res) {
  const header = req.headers["authorization"];
  if (!header) 
    return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];

  try {
    // Esta es para validar que la toker funcione
    const decoded = jwt.verify(token, SECRET);

    try {
      // Y esta otra es para la base de datos
      const userData = await getUserData(decoded.id, decoded.email);
      return res.status(200).json(userData);

    } catch (dbError) {
      console.error("DB Error:", dbError);
      return res.status(500).json({ error: "Database error" });
    }

  } catch (tokenError) {
    console.error("Token inválido o expirado:", tokenError);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

