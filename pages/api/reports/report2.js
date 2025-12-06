import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb"

export default async function handler(req, res) {
    if (req.method == "GET") {

        let conn = await getConnection();

        const result = await conn.execute(
        `BEGIN REPORTE_USUARIOS_ESTUDIANTES( :p_estudiantes_por_institucion, :p_estudiantes_por_ciudad,
            :p_estudiantes_por_region); END;`,
        {
            p_estudiantes_por_institucion: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_estudiantes_por_ciudad: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_estudiantes_por_region: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
        }, {outFormat: OUT_FORMAT_OBJECT});

        const estudiantesInstitucion = await result.outBinds.p_estudiantes_por_institucion.getRows();
        const estudiantesCiudad = await result.outBinds.p_estudiantes_por_ciudad.getRows();
        const estudiantesRegion = await result.outBinds.p_estudiantes_por_region.getRows();

        if (conn) await conn.close();

        return res.json({
            estudiantesInstitucion: estudiantesInstitucion,
            estudiantesCiudad: estudiantesCiudad,
            estudiantesRegion: estudiantesRegion
        });
    }
}
