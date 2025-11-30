import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import { getConnection } from "@/database/oracle";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb";

const SECRET = "tctoken";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método no permitido" });
    }

    let conn;

    try {
        conn = await getConnection();

        async function getPassword(email){
            const result = await conn.execute(`SELECT id_usuario, contrasenia FROM TCDB_USUARIO WHERE correo = :p_correo`,
                {p_correo: email}, {outFormat: OUT_FORMAT_OBJECT});
            return result.rows[0];
        }
    
        const {email, password} = req.body;
    
        const user = await getPassword(email);
    
        if (!user){
            return res.status(410).json({error:'correo no valido'});
        }
        
        const hash = user.CONTRASENIA;
        const valid = bcryptjs.compareSync(password,hash);
        if (!valid) return res.status(411).json({error:'contraseña incorrecta'});
        
        const token = jwt.sign(
            {
            id: user.ID_USUARIO,
            email: email
            },
            SECRET,
            {
            expiresIn: "10h" // expira en 10 horas
            }
        );

        return res.status(200).json({token})
    } catch (error) {
        console.error("Error al ingresar sesion");
        return res.status(500).json({error: "Error en el Login"});
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (closeError) {
                console.error("Error cerrando la conexion en apiLogin", closeError);
                return res.status(500).json({error: "Error cerrando coneccion apiLogin"})
            }
        }
    }
  }