--ARCHIVO PARA CONSTRUIR PROCEDIMIENTOS ALMACENADOS
--MATIAS RODRIGUEZ, JUAN ROJAS, ANGEL SILVA, MATIAS VALENZUELA

CREATE OR REPLACE PROCEDURE SP_MOSTRAR_ARRIENDOS (
    p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
        SELECT 
            a.id_arriendo, i.tipo_inmueble, a.tipo_arriendo, a.titulo,
            CASE 
                WHEN a.tipo_arriendo = 'por habitaciones' THEN
                    TO_CHAR(MIN(h.precio), '$999,999') || ' - ' || TO_CHAR(MAX(h.precio), '$999,999')
                ELSE
                    TO_CHAR(a.precio, '$999,999')
            END AS precio_mostrado,
            i.num_habitaciones,i.num_banios, m.nombre_imagen AS imagen_portada, d.calle || ' ' || d.numero AS direccion
        FROM TCDB_ARRIENDO a
        JOIN TCDB_INMUEBLE i 
            ON i.id_inmueble = a.id_inmueble
        LEFT JOIN TCDB_DIRECCION d 
            ON d.id_direccion = i.id_direccion
        LEFT JOIN TCDB_IMAGEN_INMUEBLE m 
            ON m.id_inmueble = i.id_inmueble AND m.orden_imagen = 0
        LEFT JOIN TCDB_HABITACION h
            ON h.id_arriendo = a.id_arriendo
        GROUP BY 
            a.id_arriendo, i.tipo_inmueble, a.tipo_arriendo, a.titulo, a.precio,
            i.num_habitaciones, i.num_banios, m.nombre_imagen, d.calle, d.numero;
END;

CREATE OR REPLACE PROCEDURE SP_MOSTRAR_ARRIENDOS_POR_INSTITUCION (
    p_id_institucion IN NUMBER,
    p_cursor         OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_cursor FOR
        SELECT 
            a.id_arriendo,
            i.tipo_inmueble,
            a.tipo_arriendo,
            a.titulo,
            CASE 
                WHEN a.tipo_arriendo = 'por habitaciones' THEN
                    TO_CHAR(MIN(h.precio), '$999,999') || ' - ' || TO_CHAR(MAX(h.precio), '$999,999')
                ELSE
                    TO_CHAR(a.precio, '$999,999')
            END AS precio,
            i.num_habitaciones,
            i.num_banios,
            m.nombre_imagen AS imagen_portada,
            d.calle || ' ' || d.numero AS direccion
        FROM TCDB_ARRIENDO a
        JOIN TCDB_INMUEBLE i 
            ON i.id_inmueble = a.id_inmueble
        LEFT JOIN TCDB_DIRECCION d 
            ON d.id_direccion = i.id_direccion
        LEFT JOIN TCDB_IMAGEN_INMUEBLE m 
            ON m.id_inmueble = i.id_inmueble AND m.orden_imagen = 0
        LEFT JOIN TCDB_HABITACION h
            ON h.id_arriendo = a.id_arriendo
        JOIN TCDB_SEDE_INSTITUCION si 
            ON si.id_direccion = d.id_direccion
        JOIN TCDB_INSTITUCION inst
            ON inst.id_institucion = si.id_institucion
        WHERE inst.id_institucion = p_id_institucion
        GROUP BY 
            a.id_arriendo, i.tipo_inmueble, a.tipo_arriendo, a.titulo, a.precio,
            i.num_habitaciones, i.num_banios, m.nombre_imagen, d.calle, d.numero;
END;


CREATE OR REPLACE PROCEDURE SP_NOTIFICAR_SOLICITUD_CONTACTO (
    p_id_arriendo        IN NUMBER,
    p_id_solicitante     IN NUMBER
) IS
    v_id_arrendador   NUMBER;
    v_titulo_arriendo VARCHAR2(100);
    v_nombre_solic    VARCHAR2(100);
    v_enlace VARCHAR2(100);
BEGIN
    --------------------------------------------------------------------
    -- 1. Obtener id_arrendador del arriendo
    --------------------------------------------------------------------
    SELECT i.id_arrendador
    INTO v_id_arrendador
    FROM TCDB_ARRIENDO a JOIN TCDB_INMUEBLE i ON (i.id_inmueble = a.id_inmueble)
    WHERE a.id_arriendo = p_id_arriendo;

    --------------------------------------------------------------------
    -- 2. Obtener titulo del arriendo
    --------------------------------------------------------------------
    SELECT titulo
    INTO v_titulo_arriendo
    FROM TCDB_ARRIENDO
    WHERE id_arriendo = p_id_arriendo;

    --------------------------------------------------------------------
    -- 3. Obtener nombre completo del solicitante
    --------------------------------------------------------------------
    SELECT nombre || ' ' || apellido1
    INTO v_nombre_solic
    FROM TCDB_USUARIO
    WHERE id_usuario = p_id_solicitante;

    v_enlace := '/request?u='|| p_id_solicitante ||CHR(38)||'r='|| p_id_arriendo;
    --------------------------------------------------------------------
    -- 3. Llamar al CRUD_NOTIFICACION
    --------------------------------------------------------------------
    CRUD_NOTIFICACION(
        'I',                 
        NULL, 
        v_id_arrendador,     
        'solicitud',         
        v_nombre_solic || 'ha solicitado contacto',   
        'El usuario ' || v_nombre_solic ||' ha solicitado contacto para tu arriendo '|| v_titulo_arriendo,
        'nuevo',           
        v_enlace,             
        SYSDATE             
    );
END;

CREATE OR REPLACE PROCEDURE SP_NOTIFICAR_RESPUESTA_SOLICITUD (
    p_id_arriendo        IN NUMBER,
    p_id_solicitante     IN NUMBER,
    p_respuesta         IN VARCHAR2
) IS
    v_titulo_arriendo VARCHAR2(100);
    v_nombre_solic    VARCHAR2(100);
    v_enlace VARCHAR2(100);
BEGIN

    --------------------------------------------------------------------
    -- 1. Obtener titulo del arriendo
    --------------------------------------------------------------------
    SELECT titulo
    INTO v_titulo_arriendo
    FROM TCDB_ARRIENDO
    WHERE id_arriendo = p_id_arriendo;

    --------------------------------------------------------------------
    -- 2. Obtener nombre completo del solicitante
    --------------------------------------------------------------------
    SELECT nombre || ' ' || apellido1
    INTO v_nombre_solic
    FROM TCDB_USUARIO
    WHERE id_usuario = p_id_solicitante;

    v_enlace := '/request?u='|| p_id_solicitante ||CHR(38)||'r='|| p_id_arriendo;
    --------------------------------------------------------------------
    -- 3. Llamar al CRUD_NOTIFICACION
    --------------------------------------------------------------------
    CRUD_NOTIFICACION(
        'I',                 
        NULL, 
        p_id_solicitante,     
        'solicitud',         
        'Solicitud de contacto ha recibido una respuesta',   
        'Tu solicitud contacto para el arriendo '|| v_titulo_arriendo ||' ha sido '|| p_respuesta,
        'nuevo',           
        v_enlace,             
        SYSDATE             
    );
END;

CREATE OR REPLACE PROCEDURE SP_NOTIFICAR_CAMBIO_PRECIO (
    p_id_arriendo        IN NUMBER,
    p_id_usuario     IN NUMBER,
    p_tipo IN VARCHAR2,
    p_precio_anterior IN NUMBER,
    p_precio_nuevo IN NUMBER
) IS
    v_titulo_arriendo VARCHAR2(100);
    v_enlace VARCHAR2(100);

BEGIN
    --------------------------------------------------------------------
    -- 1. Obtener titulo del arriendo
    --------------------------------------------------------------------
    SELECT titulo
    INTO v_titulo_arriendo
    FROM TCDB_ARRIENDO
    WHERE id_arriendo = p_id_arriendo;

    v_enlace := '/rental/' || p_id_arriendo;
    --------------------------------------------------------------------
    -- 3. Llamar al CRUD_NOTIFICACION
    --------------------------------------------------------------------
    IF p_tipo = 'arriendo' THEN
        CRUD_NOTIFICACION(
            'I',                 
            NULL, 
            p_id_usuario,     
            'interaccion',         
            'Un arriendo de tu interés a cambiado de precio',   
            'El precio del arriendo' || v_titulo_arriendo ||' ha cambiado de '|| TO_CHAR(p_precio_anterior, '$99,999,999') || ' a ' || TO_CHAR(p_precio_nuevo, '$99,999,999'),
            'nuevo',           
            v_enlace,             
            SYSDATE             
        );
    ELSIF p_tipo = 'habitacion' THEN
        CRUD_NOTIFICACION(
            'I',                 
            NULL, 
            p_id_usuario,     
            'interaccion',         
            'Un arriendo de tu interés a cambiado de precio',   
            'El precio de una habitacion del arriendo' || v_titulo_arriendo ||' ha cambiado de '|| TO_CHAR(p_precio_anterior, '$99,999,999') || ' a ' || TO_CHAR(p_precio_nuevo, '$99,999,999'),
            'nuevo',           
            v_enlace,             
            SYSDATE             
        );
    END IF;
END;