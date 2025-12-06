import { getConnection } from "@/database/oracle";
import oracledb from "oracledb";
import { OUT_FORMAT_OBJECT, outFormat } from "oracledb"

export default async function handler(req, res) {
    if (req.method == "GET") {

        let conn = await getConnection();

        const result = await conn.execute(
        `BEGIN REPORTE_PRECIOS_ARRIENDOS( :p_precio_promedio_por_tipo_arriendo, :p_precio_promedio_por_ciudad,
        :p_precio_promedio_por_region, :p_precios_de_interes ); END;`,
        {
            p_precio_promedio_por_tipo_arriendo: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_precio_promedio_por_ciudad: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_precio_promedio_por_region: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
            p_precios_de_interes: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
        }, {outFormat: OUT_FORMAT_OBJECT});

        const precioTipo = await result.outBinds.p_precio_promedio_por_tipo_arriendo.getRows();
        const precioCiudad = await result.outBinds.p_precio_promedio_por_ciudad.getRows();
        const precioRegion = await result.outBinds.p_precio_promedio_por_region.getRows();
        const preciosInteres = await result.outBinds.p_precios_de_interes.getRows();

        if (conn) await conn.close();

        return res.json({
            precioTipo: precioTipo,
            precioCiudadMayores: precioCiudad.slice(0,5),
            precioCiudadMenores: precioCiudad.slice(-5).reverse(),
            precioRegionMayores: precioRegion.slice(0,5),
            precioRegionMenores: precioRegion.slice(-5).reverse(),
            preciosInteres: preciosInteres
        });
    }
}
