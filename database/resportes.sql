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
        FROM TCDB_ARRIENDO a
        LEFT JOIN TCDB_SOLICITUD s ON s.id_arriendo = a.id_arriendo
        WHERE a.tipo_arriendo IN ('por completo', 'por habitaciones')
        GROUP BY a.tipo_arriendo
        ORDER BY total_solicitudes DESC;

    ---------------------------------------------------------------------
    -- 2. Tipo de arriendo más ofertado
    ---------------------------------------------------------------------
    OPEN p_arriendo_mas_ofertado FOR
        SELECT tipo_arriendo, COUNT(*) AS total_ofertas
        FROM TCDB_ARRIENDO
        WHERE tipo_arriendo IN ('por completo', 'por habitaciones')
        GROUP BY tipo_arriendo
        ORDER BY total_ofertas DESC;

    ---------------------------------------------------------------------
    -- 3. Tipo de inmueble más solicitado
    ---------------------------------------------------------------------
    OPEN p_inmueble_mas_solicitado FOR
        SELECT i.tipo_inmueble, COUNT(s.id_arriendo) AS total_solicitudes
        FROM TCDB_INMUEBLE i
        LEFT JOIN TCDB_ARRIENDO a ON a.id_inmueble = i.id_inmueble
        LEFT JOIN TCDB_SOLICITUD s ON s.id_arriendo = a.id_arriendo
        WHERE i.tipo_inmueble IN ('casa', 'departamento')
        GROUP BY i.tipo_inmueble
        ORDER BY total_solicitudes DESC;

    ---------------------------------------------------------------------
    -- 4. Tipo de inmueble más ofertado
    ---------------------------------------------------------------------
    OPEN p_inmueble_mas_ofertado FOR
        SELECT tipo_inmueble, COUNT(*) AS total_ofertas
        FROM TCDB_INMUEBLE
        WHERE tipo_inmueble IN ('casa', 'departamento')
        GROUP BY tipo_inmueble
        ORDER BY total_ofertas DESC;
END;

CREATE OR REPLACE PROCEDURE REPORTE_USUARIOS_ESTUDIANTES(
    p_estudiantes_por_institucion OUT SYS_REFCURSOR,
    p_estudiantes_por_ciudad      OUT SYS_REFCURSOR,
    p_estudiantes_por_region      OUT SYS_REFCURSOR
)
AS
BEGIN
    ---------------------------------------------------------------------
    -- 1. Número de estudiantes por institución educativa
    ---------------------------------------------------------------------
    OPEN p_estudiantes_por_institucion FOR
        SELECT ins.nombre, COUNT(u.id_usuario) AS total_estudiantes
        FROM TCDB_INSTITUCION ins
        LEFT JOIN TCDB_SEDE_INSTITUCION s ON s.id_institucion = ins.id_institucion
        LEFT JOIN TCDB_USUARIO u ON u.id_sede_institucion = s.id_sede AND u.rol_usuario = 'estudiante'
        GROUP BY ins.nombre
        ORDER BY total_estudiantes DESC
        FETCH FIRST 5 ROWS ONLY;

    ---------------------------------------------------------------------
    -- 2. Número de estudiantes por ciudad
    ---------------------------------------------------------------------

    OPEN p_estudiantes_por_ciudad FOR
        SELECT c.nombre, COUNT(u.id_usuario) AS total_estudiantes
        FROM TCDB_CIUDAD c
        LEFT JOIN TCDB_DIRECCION d ON d.id_ciudad = c.id_ciudad
        LEFT JOIN TCDB_SEDE_INSTITUCION s ON s.id_direccion = d.id_direccion
        LEFT JOIN TCDB_USUARIO u ON u.id_sede_institucion = s.id_sede AND u.rol_usuario = 'estudiante'
        GROUP BY c.nombre
        ORDER BY total_estudiantes DESC
        FETCH FIRST 5 ROWS ONLY;

    ---------------------------------------------------------------------
    -- 3. Número de estudiantes por región
    ---------------------------------------------------------------------
    OPEN p_estudiantes_por_region FOR
        SELECT r.nombre, COUNT(u.id_usuario) AS total_estudiantes
        FROM TCDB_REGION r
        LEFT JOIN TCDB_CIUDAD c ON c.id_region = r.id_region
        LEFT JOIN TCDB_DIRECCION d ON d.id_ciudad = c.id_ciudad
        LEFT JOIN TCDB_SEDE_INSTITUCION s ON s.id_direccion = d.id_direccion
        LEFT JOIN TCDB_USUARIO u ON u.id_sede_institucion = s.id_sede AND u.rol_usuario = 'estudiante'
        GROUP BY r.nombre
        ORDER BY total_estudiantes DESC;
END;

CREATE OR REPLACE PROCEDURE REPORTE_PRECIOS_ARRIENDOS(
    p_precio_promedio_por_tipo_arriendo  OUT SYS_REFCURSOR,
    p_precio_promedio_por_ciudad  OUT SYS_REFCURSOR,
    p_precio_promedio_por_region  OUT SYS_REFCURSOR,
    p_precios_de_interes  OUT SYS_REFCURSOR
)
AS
BEGIN
    ---------------------------------------------------------------------
    -- 1. Precio promedio de arriendo por tipo de arriendo
    ---------------------------------------------------------------------
    OPEN p_precio_promedio_por_tipo_arriendo FOR
    SELECT tipo_arriendo, ROUND(AVG(precio_prom)) AS precio_promedio
    FROM (
        SELECT 
            a.tipo_arriendo,
            a.precio AS precio_prom
        FROM TCDB_ARRIENDO a
        WHERE a.tipo_arriendo = 'por completo'

        UNION ALL

        SELECT 
            a.tipo_arriendo,
            (
                SELECT AVG(h.precio)
                FROM TCDB_HABITACION h
                WHERE h.id_arriendo = a.id_arriendo
            ) AS precio_prom
        FROM TCDB_ARRIENDO a
        WHERE a.tipo_arriendo = 'por habitaciones'
    )
    GROUP BY tipo_arriendo;
    
    ---------------------------------------------------------------------
    -- 2. Precio promedio de arriendo por ciudad
    ---------------------------------------------------------------------
    OPEN p_precio_promedio_por_ciudad FOR
    SELECT 
        ciudad,
        ROUND(AVG(precio_prom)) AS precio_promedio
    FROM (
        SELECT 
            c.nombre AS "CIUDAD",
            a.precio AS precio_prom
        FROM TCDB_ARRIENDO a
        JOIN TCDB_INMUEBLE i ON i.id_inmueble = a.id_inmueble
        JOIN TCDB_DIRECCION d ON d.id_direccion = i.id_direccion
        JOIN TCDB_CIUDAD c ON c.id_ciudad = d.id_ciudad
        WHERE a.tipo_arriendo = 'por completo'
        UNION ALL

        SELECT 
            c.nombre AS "CIUDAD",
            (
                SELECT AVG(h.precio)
                FROM TCDB_HABITACION h
                WHERE h.id_arriendo = a.id_arriendo
            ) AS precio_prom
        FROM TCDB_ARRIENDO a
        JOIN TCDB_INMUEBLE i ON i.id_inmueble = a.id_inmueble
        JOIN TCDB_DIRECCION d ON d.id_direccion = i.id_direccion
        JOIN TCDB_CIUDAD c ON c.id_ciudad = d.id_ciudad
        WHERE a.tipo_arriendo = 'por habitaciones'
    )
    GROUP BY ciudad
    ORDER BY precio_promedio DESC;

    --------------------------------------------------------------------- 
    -- 3. Precio promedio de arriendo por región
    ---------------------------------------------------------------------
    OPEN p_precio_promedio_por_region FOR
    SELECT 
        region,
        ROUND(AVG(precio_prom)) AS precio_promedio
    FROM (

        SELECT 
            r.nombre AS "REGION",
            a.precio AS precio_prom
        FROM TCDB_ARRIENDO a
        JOIN TCDB_INMUEBLE i ON i.id_inmueble = a.id_inmueble
        JOIN TCDB_DIRECCION d ON d.id_direccion = i.id_direccion
        JOIN TCDB_CIUDAD c ON c.id_ciudad = d.id_ciudad
        JOIN TCDB_REGION r ON r.id_region = c.id_region
        WHERE a.tipo_arriendo = 'por completo'
        UNION ALL

        SELECT 
            r.nombre AS "REGION",
            (
                SELECT AVG(h.precio)
                FROM TCDB_HABITACION h
                WHERE h.id_arriendo = a.id_arriendo
            ) AS precio_prom
        FROM TCDB_ARRIENDO a
        JOIN TCDB_INMUEBLE i ON i.id_inmueble = a.id_inmueble
        JOIN TCDB_DIRECCION d ON d.id_direccion = i.id_direccion
        JOIN TCDB_CIUDAD c ON c.id_ciudad = d.id_ciudad
        JOIN TCDB_REGION r ON r.id_region = c.id_region
        WHERE a.tipo_arriendo = 'por habitaciones'
    )
    GROUP BY region
    ORDER BY precio_promedio DESC;

    ---------------------------------------------------------------------
    -- 4. Precios de interés (mínimo, máximo y mediano)
    ---------------------------------------------------------------------
    OPEN p_precios_de_interes FOR
    SELECT 
        MIN(precio_total) AS precio_minimo,
        MAX(precio_total) AS precio_maximo,
        MEDIAN(precio_total) AS precio_mediano
    FROM (
        SELECT 
            a.precio AS precio_total
        FROM TCDB_ARRIENDO a
        JOIN TCDB_INTERACCION ar ON ar.id_arriendo = a.id_arriendo
        WHERE ar.tipo_interaccion = 'guardado' AND a.tipo_arriendo = 'por completo'
        UNION ALL
        SELECT 
            (
                SELECT AVG(h.precio)
                FROM TCDB_HABITACION h
                WHERE h.id_arriendo = a.id_arriendo
            ) AS precio_total
        FROM TCDB_ARRIENDO a
        JOIN TCDB_INTERACCION ar ON ar.id_arriendo = a.id_arriendo
        WHERE ar.tipo_interaccion = 'guardado' AND a.tipo_arriendo = 'por habitaciones'
    );
END; 