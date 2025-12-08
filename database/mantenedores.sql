--ARCHIVO PARA CONSTRUIR MANTENEDORES
--MATIAS RODRIGUEZ, JUAN ROJAS, ANGEL SILVA, MATIAS VALENZUELA

CREATE OR REPLACE PROCEDURE CRUD_USUARIO(
    p_operacion        IN VARCHAR2,          -- 'I', 'U', 'D'
    p_id_usuario       IN NUMBER,        
    p_rol_usuario      IN VARCHAR2 DEFAULT NULL,
    p_rut              IN VARCHAR2 DEFAULT NULL,
    p_nombre           IN VARCHAR2 DEFAULT NULL,
    p_apellido1        IN VARCHAR2 DEFAULT NULL,
    p_apellido2        IN VARCHAR2 DEFAULT NULL,
    p_correo           IN VARCHAR2 DEFAULT NULL,
    p_contrasenia      IN VARCHAR2 DEFAULT NULL,
    p_telefono         IN VARCHAR2 DEFAULT NULL,
    p_fecha_nacimiento IN DATE DEFAULT NULL,
    p_genero           IN VARCHAR2 DEFAULT NULL,
    p_id_sede_inst     IN NUMBER DEFAULT NULL,
    p_id_ciudad        IN NUMBER DEFAULT NULL,
    p_imagen_perfil    IN VARCHAR2 DEFAULT NULL
) AS
BEGIN
    LOCK TABLE TCDB_USUARIO IN ROW EXCLUSIVE MODE;
    ---------------------------------------------------------------------
    -- INSERTAR REGISTRO
    ---------------------------------------------------------------------
    IF p_operacion = 'I' THEN
        INSERT INTO TCDB_USUARIO(
            rol_usuario, rut, nombre, apellido1, apellido2,
            correo, contrasenia, telefono, fecha_nacimiento, genero,
            id_sede_institucion, id_ciudad, imagen_perfil
        )
        VALUES (
            p_rol_usuario,
            p_rut,
            p_nombre,
            p_apellido1,
            p_apellido2,
            p_correo,
            p_contrasenia,
            p_telefono,
            p_fecha_nacimiento,
            p_genero,
            p_id_sede_inst,
            p_id_ciudad,
            p_imagen_perfil
        );
        COMMIT;
    END IF;
    ---------------------------------------------------------------------
    -- ACTUALIZAR REGISTRO
    ---------------------------------------------------------------------
    IF p_operacion = 'U' THEN
        UPDATE TCDB_USUARIO
        SET rol_usuario         = p_rol_usuario,
            rut                 = p_rut,
            nombre              = p_nombre,
            apellido1           = p_apellido1,
            apellido2           = p_apellido2,
            correo              = p_correo,
            contrasenia         = p_contrasenia,
            telefono            = p_telefono,
            fecha_nacimiento    = p_fecha_nacimiento,
            genero              = p_genero,
            id_sede_institucion = p_id_sede_inst,
            id_ciudad           = p_id_ciudad,
            imagen_perfil       = p_imagen_perfil
        WHERE id_usuario = p_id_usuario;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20001, 'No existe usuario para actualizar.');
        END IF;

        COMMIT;
    END IF;
    ---------------------------------------------------------------------
    -- ELIMINAR REGISTRO
    ---------------------------------------------------------------------
    IF p_operacion = 'D' THEN
        DELETE FROM TCDB_USUARIO
        WHERE id_usuario = p_id_usuario;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20002, 'No existe usuario para eliminar.');
        END IF;

        COMMIT;
    END IF;
END;

CREATE OR REPLACE PROCEDURE CRUD_CIUDAD (
    p_operacion   IN  VARCHAR2,     -- 'I', 'U', 'D'
    p_id_ciudad   IN  OUT NUMBER,   -- Para insertar se retorna, para U/D se envía
    p_nombre      IN  VARCHAR2 DEFAULT NULL,
    p_id_region   IN  NUMBER   DEFAULT NULL
) IS
BEGIN
    LOCK TABLE TCDB_CIUDAD IN EXCLUSIVE MODE;
    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN 
        INSERT INTO TCDB_CIUDAD (nombre, id_region)
        VALUES (p_nombre, p_id_region)
        RETURNING id_ciudad INTO p_id_ciudad;
        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN  
        UPDATE TCDB_CIUDAD
        SET nombre    = p_nombre,
            id_region = p_id_region
        WHERE id_ciudad = p_id_ciudad;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20010, 'No existe ciudad con ese ID.');
        END IF;
        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN

        DELETE FROM TCDB_CIUDAD
        WHERE id_ciudad = p_id_ciudad;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20011, 'No existe ciudad para eliminar.');
        END IF;
        COMMIT;

    --------------------------------------------------------------------
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;

END;

create or replace PROCEDURE CRUD_DIRECCION (
    p_operacion   IN  VARCHAR2,     -- 'I', 'U', 'D'
    p_id_direccion   IN  OUT NUMBER,   -- Para insertar se retorna, para U/D se envía
    p_calle      IN  VARCHAR2 DEFAULT NULL,
    p_numero  IN  NUMBER   DEFAULT NULL,
    p_id_ciudad IN NUMBER DEFAULT NULL
) IS
BEGIN
    LOCK TABLE TCDB_DIRECCION IN EXCLUSIVE MODE;
    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN 
        INSERT INTO TCDB_DIRECCION (calle, numero, id_ciudad)
        VALUES (p_calle, p_numero, p_id_ciudad)
        RETURNING id_direccion INTO p_id_direccion;
        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN  
        UPDATE TCDB_DIRECCION
        SET calle    = p_calle,
            numero = p_numero,
            id_ciudad = p_id_ciudad
        WHERE id_direccion = p_id_direccion;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20010, 'No existe direccion con ese ID.');
        END IF;
        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN

        DELETE FROM TCDB_DIRECCION
        WHERE id_direccion = p_id_direccion;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20011, 'No existe direccion para eliminar.');
        END IF;
        COMMIT;

    --------------------------------------------------------------------
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;

END;

CREATE OR REPLACE PROCEDURE CRUD_INMUEBLE (
    p_operacion            IN  VARCHAR2,     -- 'I', 'U', 'D'
    p_id_inmueble          IN OUT NUMBER,    -- Retorna en insert, se envía en update/delete
    p_tipo_inmueble        IN VARCHAR2 DEFAULT NULL,
    p_modalidad            IN VARCHAR2 DEFAULT NULL,
    p_nombre               IN VARCHAR2 DEFAULT NULL,
    p_propietario          IN VARCHAR2 DEFAULT NULL,
    p_id_arrendador        IN NUMBER   DEFAULT NULL,
    p_descripcion          IN VARCHAR2 DEFAULT NULL,
    p_num_habitaciones     IN NUMBER   DEFAULT NULL,
    p_num_banios           IN NUMBER   DEFAULT NULL,
    p_id_direccion         IN NUMBER   DEFAULT NULL,
    p_direccion_adicional  IN VARCHAR2 DEFAULT NULL,
    p_estado               IN VARCHAR2 DEFAULT NULL,
    p_origen_contacto      IN VARCHAR2 DEFAULT NULL,
    p_telefono_contacto    IN VARCHAR2 DEFAULT NULL,
    p_correo_contacto      IN VARCHAR2 DEFAULT NULL
) IS
BEGIN
    LOCK TABLE TCDB_INMUEBLE IN EXCLUSIVE MODE;
    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN 

        INSERT INTO TCDB_INMUEBLE (
            tipo_inmueble, modalidad, nombre, propietario, id_arrendador, descripcion,
            num_habitaciones, num_banios, id_direccion, direccion_adicional,
            estado, origen_contacto, telefono_contacto, correo_contacto
        )
        VALUES (
            p_tipo_inmueble, p_modalidad, p_nombre, p_propietario, p_id_arrendador, p_descripcion,
            p_num_habitaciones, p_num_banios, p_id_direccion, p_direccion_adicional,
            p_estado, p_origen_contacto, p_telefono_contacto, p_correo_contacto
        )
        RETURNING id_inmueble INTO p_id_inmueble;
        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN

        UPDATE TCDB_INMUEBLE
        SET tipo_inmueble       = p_tipo_inmueble,
            modalidad           = p_modalidad,
            nombre              = p_nombre,
            propietario         = p_propietario,
            id_arrendador       = p_id_arrendador,
            descripcion         = p_descripcion,
            num_habitaciones    = p_num_habitaciones,
            num_banios          = p_num_banios,
            id_direccion        = p_id_direccion,
            direccion_adicional = p_direccion_adicional,
            estado              = p_estado,
            origen_contacto     = p_origen_contacto,
            telefono_contacto   = p_telefono_contacto,
            correo_contacto     = p_correo_contacto
        WHERE id_inmueble = p_id_inmueble;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20020, 'No existe inmueble con ese ID.');
        END IF;
        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN

        DELETE FROM TCDB_INMUEBLE
        WHERE id_inmueble = p_id_inmueble;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20021, 'No existe inmueble para eliminar.');
        END IF;
        COMMIT;

    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;
END;

CREATE OR REPLACE PROCEDURE CRUD_ARRIENDO (
    p_operacion        IN  VARCHAR2,    -- 'I', 'U', 'D'
    p_id_arriendo      IN OUT NUMBER,   -- Retorna en insert, se envía en update/delete
    p_tipo_arriendo    IN VARCHAR2 DEFAULT NULL,
    p_titulo           IN VARCHAR2 DEFAULT NULL,
    p_id_unidad        IN NUMBER   DEFAULT NULL,
    p_precio           IN NUMBER   DEFAULT NULL,
    p_descripcion      IN VARCHAR2 DEFAULT NULL,
    p_estado           IN VARCHAR2 DEFAULT NULL,
    p_fecha            IN DATE     DEFAULT NULL
) IS
BEGIN
    LOCK TABLE TCDB_ARRIENDO IN EXCLUSIVE MODE;

    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN
        INSERT INTO TCDB_ARRIENDO (
            tipo_arriendo, titulo, id_unidad_arriendo, precio,
            descripcion, estado, fecha
        )
        VALUES (
            p_tipo_arriendo, p_titulo, p_id_unidad, p_precio,
            p_descripcion, p_estado, p_fecha
        )
        RETURNING id_arriendo INTO p_id_arriendo;

        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN

        UPDATE TCDB_ARRIENDO
        SET tipo_arriendo      = p_tipo_arriendo,
            titulo             = p_titulo,
            id_unidad_arriendo = p_id_unidad,
            precio             = p_precio,
            descripcion        = p_descripcion,
            estado             = p_estado,
            fecha              = p_fecha
        WHERE id_arriendo = p_id_arriendo;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20030, 'No existe arriendo con ese ID.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN

        DELETE FROM TCDB_ARRIENDO
        WHERE id_arriendo = p_id_arriendo;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20031, 'No existe arriendo para eliminar.');
        END IF;

        COMMIT;
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;
END;

CREATE OR REPLACE PROCEDURE CRUD_HABITACION (
    p_operacion        IN  VARCHAR2,     -- 'I', 'U', 'D'
    p_id_habitacion    IN NUMBER,    -- Retorna en insert, se envía en update/delete
    p_id_arriendo      IN NUMBER   DEFAULT NULL,
    p_nombre           IN VARCHAR2 DEFAULT NULL,
    p_superficie       IN NUMBER   DEFAULT NULL,
    p_descripcion      IN VARCHAR2 DEFAULT NULL,
    p_precio           IN NUMBER DEFAULT NULL,
    p_imagen_portada   IN VARCHAR2 DEFAULT NULL
) IS
BEGIN
    LOCK TABLE TCDB_HABITACION IN EXCLUSIVE MODE;

    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN
        INSERT INTO TCDB_HABITACION (id_habitacion, nombre, id_arriendo, superficie, descripcion, precio, imagen_portada)
        VALUES (p_id_habitacion, p_nombre, p_id_arriendo, p_superficie, p_descripcion, p_precio, p_imagen_portada);
        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN

        UPDATE TCDB_HABITACION
        SET id_arriendo    = p_id_arriendo,
            nombre         = p_nombre,
            superficie     = p_superficie,
            descripcion    = p_descripcion,
            precio         = p_precio,
            imagen_portada = p_imagen_portada
        WHERE id_habitacion = p_id_habitacion;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20040, 'No existe habitación con ese ID.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN

        DELETE FROM TCDB_HABITACION
        WHERE id_habitacion = p_id_habitacion;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20041, 'No existe habitación para eliminar.');
        END IF;

        COMMIT;

    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;
END;

CREATE OR REPLACE PROCEDURE CRUD_IMAGEN_INMUEBLE(
    p_operacion   IN  VARCHAR2,     -- 'I', 'U', 'D'
    p_id_imagen   IN  NUMBER,   -- Para insertar se retorna, para U/D se envía
    p_id_inmueble     IN  NUMBER DEFAULT NULL,
    p_orden_imagen    IN  NUMBER DEFAULT NULL,
    p_nombre_imagen   IN  VARCHAR2   DEFAULT NULL
) IS
BEGIN
    LOCK TABLE TCDB_IMAGEN_INMUEBLE IN EXCLUSIVE MODE;
    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN 
        INSERT INTO TCDB_IMAGEN_INMUEBLE (id_inmueble, orden_imagen, nombre_imagen)
        VALUES (p_id_inmueble, p_orden_imagen, p_nombre_imagen);
        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN  
        UPDATE TCDB_IMAGEN_INMUEBLE
        SET id_inmueble   = p_id_inmueble, 
            orden_imagen  = p_orden_imagen,
            nombre_imagen = p_nombre_imagen
        WHERE id_imagen= p_id_imagen;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20010, 'No existe imagen con ese ID.');
        END IF;
        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN

        DELETE FROM TCDB_IMAGEN_INMUEBLE
        WHERE id_imagen = p_id_imagen;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20011, 'No existe imagen para eliminar.');
        END IF;
        COMMIT;

    --------------------------------------------------------------------
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;

END;

CREATE OR REPLACE PROCEDURE CRUD_INSTITUCION (
    p_operacion       IN  VARCHAR2,
    p_id_institucion  IN NUMBER,
    p_nombre          IN VARCHAR2 DEFAULT NULL,
    p_tipo_institucion IN VARCHAR2 DEFAULT NULL
) IS
    v_tipo_normalizado VARCHAR2(50);
BEGIN
    v_tipo_normalizado := LOWER(p_tipo_institucion);

    IF p_operacion = 'I' OR p_operacion = 'U' THEN
        IF v_tipo_normalizado NOT IN (
            'universidad',
            'instituto profesional',
            'centro de formacion tecnica'
        ) THEN
            RAISE_APPLICATION_ERROR(-20020,
                'Tipo de institución inválido. Debe ser: universidad, instituto profesional o centro de formacion tecnica.');
        END IF;
    END IF;

    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN
        INSERT INTO TCDB_INSTITUCION (nombre, tipo_institucion)
        VALUES (p_nombre, v_tipo_normalizado);
        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN
        UPDATE TCDB_INSTITUCION
        SET nombre = p_nombre,
            tipo_institucion = v_tipo_normalizado
        WHERE id_institucion = p_id_institucion;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20021, 'No existe institución con ese ID.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN
        DELETE FROM TCDB_INSTITUCION
        WHERE id_institucion = p_id_institucion;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20022, 'No existe institución para eliminar.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;

END;

CREATE OR REPLACE PROCEDURE CRUD_SEDE_INSTITUCION (
    p_operacion      IN  VARCHAR2,     -- 'I', 'U', 'D'
    p_id_sede        IN OUT NUMBER,    -- Solo OUT en insert, IN en update/delete
    p_nombre         IN  VARCHAR2 DEFAULT NULL,
    p_id_institucion IN  NUMBER   DEFAULT NULL,
    p_id_direccion   IN  NUMBER   DEFAULT NULL
)
IS
BEGIN
    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN
        
        INSERT INTO TCDB_SEDE_INSTITUCION (
            nombre, id_institucion, id_direccion
        ) VALUES (
            p_nombre, p_id_institucion, p_id_direccion
        )
        RETURNING id_sede INTO p_id_sede;

        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN

        UPDATE TCDB_SEDE_INSTITUCION
        SET nombre         = p_nombre,
            id_institucion = p_id_institucion,
            id_direccion   = p_id_direccion
        WHERE id_sede = p_id_sede;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20020, 'No existe sede con ese ID.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN

        DELETE FROM TCDB_SEDE_INSTITUCION
        WHERE id_sede = p_id_sede;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20021, 'No existe sede para eliminar.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;

END CRUD_SEDE_INSTITUCION;

CREATE OR REPLACE PROCEDURE CRUD_REGION (
    p_operacion   IN  VARCHAR2,     -- 'I', 'U', 'D'
    p_id_REGION   IN  OUT NUMBER,   -- Para insertar se retorna, para U/D se envía
    p_nombre      IN  VARCHAR2 DEFAULT NULL
) IS
BEGIN
    LOCK TABLE TCDB_REGION IN EXCLUSIVE MODE;
    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN 
        INSERT INTO TCDB_REGION (nombre)
        VALUES (p_nombre)
        RETURNING id_REGION INTO p_id_REGION;
        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN  
        UPDATE TCDB_REGION
        SET nombre    = p_nombre
        WHERE id_REGION = p_id_REGION;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20010, 'No existe region con ese ID.');
        END IF;
        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN

        DELETE FROM TCDB_REGION
        WHERE id_REGION = p_id_REGION;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20011, 'No existe region para eliminar.');
        END IF;
        COMMIT;

    --------------------------------------------------------------------
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;

END;

CREATE OR REPLACE PROCEDURE CRUD_INTERACCION (
    p_operacion     IN  VARCHAR2,     -- 'I', 'U', 'D'
    p_id_usuario    IN  NUMBER,
    p_id_arriendo   IN  NUMBER,
    p_tipo_interaccion   IN  VARCHAR2 DEFAULT NULL,
    p_fecha         IN  DATE DEFAULT NULL
) IS
BEGIN
    LOCK TABLE TCDB_INTERACCION IN EXCLUSIVE MODE;

    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN
        INSERT INTO TCDB_INTERACCION (id_usuario, id_arriendo, tipo_interaccion, fecha)
        VALUES (p_id_usuario, p_id_arriendo, p_tipo_interaccion, p_fecha);

        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN
        UPDATE TCDB_INTERACCION
        SET tipo_interaccion = p_tipo_interaccion,
            fecha       = p_fecha
        WHERE id_usuario  = p_id_usuario
          AND id_arriendo = p_id_arriendo;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20020, 'No existe interacción con ese usuario y arriendo.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN
        DELETE FROM TCDB_INTERACCION
        WHERE id_usuario  = p_id_usuario
          AND id_arriendo = p_id_arriendo;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20021, 'No existe interacción para eliminar.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;

END;

CREATE OR REPLACE PROCEDURE CRUD_SOLICITUD (
    p_operacion     IN  VARCHAR2,     -- 'I', 'U', 'D'
    p_id_usuario    IN  NUMBER,
    p_id_arriendo   IN  NUMBER,
    p_estado_solicitud   IN  VARCHAR2 DEFAULT NULL,
    p_fecha_hora         IN  DATE DEFAULT NULL
) IS
BEGIN
    LOCK TABLE TCDB_SOLICITUD IN EXCLUSIVE MODE;

    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN
        INSERT INTO TCDB_SOLICITUD (id_usuario, id_arriendo, estado_solicitud, fecha_hora)
        VALUES (p_id_usuario, p_id_arriendo, p_estado_solicitud, p_fecha_hora);

        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN
        UPDATE TCDB_SOLICITUD
        SET estado_solicitud = NVL(p_estado_solicitud,estado_solicitud),
            fecha_hora       = NVL(p_fecha_hora,fecha_hora)
        WHERE id_usuario  = p_id_usuario
          AND id_arriendo = p_id_arriendo;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20020, 'No existe solicitud con ese usuario y arriendo.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN
        DELETE FROM TCDB_SOLICITUD
        WHERE id_usuario  = p_id_usuario
          AND id_arriendo = p_id_arriendo;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20021, 'No existe solicitud para eliminar.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;

END;


CREATE OR REPLACE PROCEDURE CRUD_NOTIFICACION (
    p_operacion        IN  VARCHAR2,     -- 'I', 'U', 'D'
    p_id_notificacion  IN  NUMBER, 
    p_id_usuario       IN  NUMBER DEFAULT NULL,
    p_tipo_notificacion IN  VARCHAR2 DEFAULT NULL,
    p_titulo           IN  VARCHAR2 DEFAULT NULL,
    p_mensaje          IN  VARCHAR2 DEFAULT NULL,
    p_estado           IN  VARCHAR2 DEFAULT NULL,
    p_enlace           IN  VARCHAR2 DEFAULT NULL,
    p_fecha_hora       IN  DATE DEFAULT NULL
) IS
BEGIN
    LOCK TABLE TCDB_NOTIFICACION IN EXCLUSIVE MODE;

    --------------------------------------------------------------------
    -- INSERT
    --------------------------------------------------------------------
    IF p_operacion = 'I' THEN
        INSERT INTO TCDB_NOTIFICACION (
            id_usuario,
            tipo_notificacion,
            titulo,
            mensaje,
            estado,
            enlace,
            fecha_hora
        ) VALUES (
            p_id_usuario,
            p_tipo_notificacion,
            p_titulo,
            p_mensaje,
            p_estado,
            p_enlace,
            p_fecha_hora
        )
        RETURNING id_notificacion INTO p_id_notificacion;

        COMMIT;

    --------------------------------------------------------------------
    -- UPDATE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'U' THEN
        UPDATE TCDB_NOTIFICACION
        SET tipo_notificacion = NVL(p_tipo_notificacion, tipo_notificacion),
            id_usuario        = NVL(p_id_usuario, id_usuario),
            titulo            = NVL(p_titulo, titulo),
            mensaje           = NVL(p_mensaje, mensaje),
            estado            = NVL(p_estado, estado),
            enlace            = NVL(p_enlace, enlace),
            fecha_hora        = NVL(p_fecha_hora, fecha_hora)
        WHERE id_notificacion = p_id_notificacion;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20030, 'No existe notificación con ese ID.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    -- DELETE
    --------------------------------------------------------------------
    ELSIF p_operacion = 'D' THEN
        DELETE FROM TCDB_NOTIFICACION
        WHERE id_notificacion = p_id_notificacion;

        IF SQL%ROWCOUNT = 0 THEN
            ROLLBACK;
            RAISE_APPLICATION_ERROR(-20031, 'No existe notificación para eliminar.');
        END IF;

        COMMIT;

    --------------------------------------------------------------------
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Operación inválida. Use I, U o D.');
    END IF;
END;
