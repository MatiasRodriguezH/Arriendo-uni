CREATE OR REPLACE PROCEDURE REPORTE_MERCADO_ARRIENDOS(
    p_arriendo_mas_solicitado   OUT SYS_REFCURSOR,
    p_arriendo_mas_ofertado     OUT SYS_REFCURSOR,
    p_inmueble_mas_solicitado   OUT SYS_REFCURSOR,
    p_inmueble_mas_ofertado     OUT SYS_REFCURSOR
)
AS
BEGIN
    ---------------------------------------------------------------------
    -- 1. Tipo de arriendo más solicitado
    ---------------------------------------------------------------------
    OPEN p_arriendo_mas_solicitado FOR
        SELECT a.tipo_arriendo, COUNT(s.id_arriendo) AS total_solicitudes
        FROM TCDB_SOLICITUD s
        JOIN TCDB_ARRIENDO a ON s.id_arriendo = a.id_arriendo
        GROUP BY a.tipo_arriendo
        ORDER BY total_solicitudes DESC;

    ---------------------------------------------------------------------
    -- 2. Tipo de arriendo más ofertado
    ---------------------------------------------------------------------
    OPEN p_arriendo_mas_ofertado FOR
        SELECT tipo_arriendo, COUNT(*) AS total_ofertas
        FROM TCDB_ARRIENDO
        GROUP BY tipo_arriendo
        ORDER BY total_ofertas DESC;

    ---------------------------------------------------------------------
    -- 3. Tipo de inmueble más solicitado
    ---------------------------------------------------------------------
    OPEN p_inmueble_mas_solicitado FOR
        SELECT i.tipo_inmueble, COUNT(s.id_arriendo) AS total_solicitudes
        FROM TCDB_SOLICITUD s
        JOIN TCDB_ARRIENDO a ON s.id_arriendo = a.id_arriendo
        JOIN TCDB_INMUEBLE i ON a.id_inmueble = i.id_inmueble
        GROUP BY i.tipo_inmueble
        ORDER BY total_solicitudes DESC;

    ---------------------------------------------------------------------
    -- 4. Tipo de inmueble más ofertado
    ---------------------------------------------------------------------
    OPEN p_inmueble_mas_ofertado FOR
        SELECT tipo_inmueble, COUNT(*) AS total_ofertas
        FROM TCDB_INMUEBLE
        GROUP BY tipo_inmueble
        ORDER BY total_ofertas DESC;
END;

