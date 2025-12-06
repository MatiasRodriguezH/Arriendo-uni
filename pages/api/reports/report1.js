import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb"

export default async function handler(req, res) {
    if (req.method == "GET") {

        let conn = await getConnection();

        const result = await conn.execute(
        `BEGIN REPORTE_MERCADO_ARRIENDOS( :p_arriendo_mas_solicitado, :p_arriendo_mas_ofertado,
            :p_inmueble_mas_solicitado, :p_inmueble_mas_ofertado); END;`,
        {
            p_arriendo_mas_solicitado: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_arriendo_mas_ofertado:   { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_inmueble_mas_solicitado: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_inmueble_mas_ofertado:   { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
        }, {outFormat: OUT_FORMAT_OBJECT});

        const arriendoDem = await result.outBinds.p_arriendo_mas_solicitado.getRows();
        const arriendoOfer  = await result.outBinds.p_arriendo_mas_ofertado.getRows();
        const inmuebleDem = await result.outBinds.p_inmueble_mas_solicitado.getRows();
        const inmuebleOfer  = await result.outBinds.p_inmueble_mas_ofertado.getRows();
        if (conn) await conn.close();

        return res.json({
            arriendoDemanda: arriendoDem,
            arriendoOferta: arriendoOfer,
            inmuebleDemanda: inmuebleDem,
            inmuebleOferta: inmuebleOfer
        });
    }
}
