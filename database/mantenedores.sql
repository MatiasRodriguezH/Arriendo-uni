
CREATE OR REPLACE TRIGGER TRG_USUARIO_ID
BEFORE INSERT ON TCDB_USUARIO
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.ID_USUARIO IS NULL THEN
        SELECT NVL(MAX(ID_USUARIO),0)+1
        INTO :NEW.ID_USUARIO
        FROM TCDB_USUARIO;
    END IF;
END;

create or replace PROCEDURE crud_usuario(
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

create or replace TRIGGER TRG_CIUDAD_ID
BEFORE INSERT ON TCDB_CIUDAD
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.ID_CIUDAD IS NULL THEN
        SELECT NVL(MAX(ID_CIUDAD),0)+1
        INTO :NEW.ID_CIUDAD
        FROM TCDB_CIUDAD;
    END IF;
END;

create or replace PROCEDURE CRUD_CIUDAD (
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

create or replace FUNCTION FN_EXIST_CIUDAD (
    p_nombre     IN VARCHAR2,
    p_id_region  IN NUMBER
) RETURN NUMBER IS
    v_id_ciudad  NUMBER;
BEGIN
    SELECT id_ciudad
    INTO v_id_ciudad
    FROM TCDB_CIUDAD
    WHERE UPPER(nombre) = UPPER(p_nombre)
      AND id_region = p_id_region;

    RETURN v_id_ciudad;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        CRUD_CIUDAD('I',v_id_ciudad,p_nombre,p_id_region);
        RETURN v_id_ciudad;
END;

create or replace TRIGGER TRG_DIRECCION_ID
BEFORE INSERT ON TCDB_DIRECCION
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.ID_DIRECCION IS NULL THEN
        SELECT NVL(MAX(ID_DIRECCION),0)+1
        INTO :NEW.ID_DIRECCION
        FROM TCDB_DIRECCION;
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

create or replace FUNCTION FN_EXIST_DIRECCION (
    p_calle    IN VARCHAR2,
    p_numero  IN NUMBER,
    p_id_ciudad IN NUMBER
) RETURN NUMBER IS
    v_id_direccion NUMBER;
BEGIN
    SELECT id_direccion
    INTO v_id_direccion
    FROM TCDB_DIRECCION
    WHERE UPPER(calle) = UPPER(p_calle)
      AND numero = p_numero
      AND id_ciudad = p_id_ciudad;

    RETURN v_id_direccion;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        CRUD_DIRECCION('I',v_id_direccion,p_calle,p_numero,p_id_ciudad);
        RETURN v_id_direccion;
END;

create or replace TRIGGER TRG_INMUEBLE_ID
BEFORE INSERT ON TCDB_INMUEBLE
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.ID_INMUEBLE IS NULL THEN
        SELECT NVL(MAX(ID_INMUEBLE),0)+1
        INTO :NEW.ID_INMUEBLE
        FROM TCDB_INMUEBLE;
    END IF;
END;

create or replace PROCEDURE CRUD_INMUEBLE (
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

create or replace TRIGGER TRG_ARRIENDO_ID
BEFORE INSERT ON TCDB_ARRIENDO
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.ID_ARRIENDO IS NULL THEN
        SELECT NVL(MAX(ID_ARRIENDO),0)+1
        INTO :NEW.ID_ARRIENDO
        FROM TCDB_ARRIENDO;
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

create or replace TRIGGER TRG_HABITACION_ID
BEFORE INSERT ON TCDB_HABITACION
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.ID_HABITACION IS NULL THEN
        SELECT NVL(MAX(ID_HABITACION),0)+1
        INTO :NEW.ID_HABITACION
        FROM TCDB_HABITACION;
    END IF;
END;

create or replace PROCEDURE CRUD_HABITACION (
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

create or replace TRIGGER TRG_IMAGEN_INMUEBLE_ID
BEFORE INSERT ON TCDB_IMAGEN_INMUEBLE
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.ID_IMAGEN IS NULL THEN
        SELECT NVL(MAX(ID_IMAGEN),0)+1
        INTO :NEW.ID_IMAGEN
        FROM TCDB_IMAGEN_INMUEBLE;
    END IF;
END;

create or replace PROCEDURE CRUD_IMAGEN_INMUEBLE(
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

create or replace TRIGGER TRG_INSTITUCION_ID
BEFORE INSERT ON TCDB_INSTITUCION
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.ID_INSTITUCION IS NULL THEN
        SELECT NVL(MAX(ID_INSTITUCION),0)+1
        INTO :NEW.ID_INSTITUCION
        FROM TCDB_INSTITUCION;
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

create or replace TRIGGER TRG_SEDE_INSTITUCION_ID
BEFORE INSERT ON TCDB_SEDE_INSTITUCION
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.ID_SEDE IS NULL THEN
        SELECT NVL(MAX(ID_SEDE),0)+1
        INTO :NEW.ID_SEDE
        FROM TCDB_SEDE_INSTITUCION;
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


create or replace TRIGGER TRG_REGION_ID
BEFORE INSERT ON TCDB_REGION
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.ID_REGION IS NULL THEN
        SELECT NVL(MAX(ID_REGION),0)+1
        INTO :NEW.ID_REGION
        FROM TCDB_REGION;
    END IF;
END;

create or replace PROCEDURE CRUD_REGION (
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

CREATE OR REPLACE TRIGGER TRG_NOTIFICACION_ID
BEFORE INSERT ON TCDB_NOTIFICACION
FOR EACH ROW
DECLARE
BEGIN
    IF :NEW.ID_NOTIFICACION IS NULL THEN
        SELECT NVL(MAX(ID_NOTIFICACION),0)+1
        INTO :NEW.ID_NOTIFICACION
        FROM TCDB_NOTIFICACION;
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

CREATE OR REPLACE TRIGGER TRG_UPDATE_ESTADO_INMUEBLE_INS
AFTER INSERT ON TCDB_ARRIENDO
FOR EACH ROW
BEGIN
    UPDATE TCDB_INMUEBLE
    SET estado = 'en arriendo'
    WHERE id_inmueble = :NEW.id_inmueble;
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

CREATE OR REPLACE TRIGGER TRG_CAMBIO_PRECIO_ARRIENDO
FOR UPDATE OF precio ON TCDB_ARRIENDO
COMPOUND TRIGGER

    TYPE t_precio_info IS RECORD (
        id_arriendo     NUMBER,
        precio_old      NUMBER,
        precio_new      NUMBER
    );

    TYPE t_precio_tab IS TABLE OF t_precio_info;
    v_cambios t_precio_tab := t_precio_tab();

BEFORE EACH ROW IS
BEGIN
    IF :NEW.precio <> :OLD.precio THEN
        v_cambios.EXTEND;
        v_cambios(v_cambios.COUNT).id_arriendo := :NEW.id_arriendo;
        v_cambios(v_cambios.COUNT).precio_old  := :OLD.precio;
        v_cambios(v_cambios.COUNT).precio_new  := :NEW.precio;
    END IF;
END BEFORE EACH ROW;

AFTER STATEMENT IS
BEGIN
    FOR i IN 1 .. v_cambios.COUNT LOOP

        -- Buscar usuarios que tienen guardado este arriendo
        FOR u IN (
            SELECT id_usuario
            FROM TCDB_INTERACCION
            WHERE tipo_interaccion = 'guardado'
              AND id_arriendo = v_cambios(i).id_arriendo
        ) LOOP
            -- Crear notificación
            SP_NOTIFICAR_CAMBIO_PRECIO(v_cambios(i).id_arriendo, u.id_usuario,'arriendo', v_cambios(i).precio_old, v_cambios(i).precio_new);

        END LOOP;
    END LOOP;
END AFTER STATEMENT;
END TRG_CAMBIO_PRECIO_ARRIENDO;

CREATE OR REPLACE TRIGGER TRG_CAMBIO_PRECIO_HABITACION
FOR UPDATE OF precio ON TCDB_HABITACION
COMPOUND TRIGGER

    TYPE t_precio_info IS RECORD (
        id_arriendo  NUMBER,
        precio_old   NUMBER,
        precio_new   NUMBER
    );

    TYPE t_precio_tab IS TABLE OF t_precio_info;
    v_cambios t_precio_tab := t_precio_tab();

BEFORE EACH ROW IS
BEGIN
    IF :NEW.precio <> :OLD.precio THEN
        v_cambios.EXTEND;
        v_cambios(v_cambios.COUNT).id_arriendo := :NEW.id_arriendo;
        v_cambios(v_cambios.COUNT).precio_old  := :OLD.precio;
        v_cambios(v_cambios.COUNT).precio_new  := :NEW.precio;
    END IF;
END BEFORE EACH ROW;

AFTER STATEMENT IS
BEGIN
    FOR i IN 1 .. v_cambios.COUNT LOOP
        -- Buscar todos los usuarios que guardaron el arriendo asociado
        FOR u IN (
            SELECT id_usuario
            FROM TCDB_INTERACCION
            WHERE tipo_interaccion = 'guardado'
            AND id_arriendo = v_cambios(i).id_arriendo
        ) LOOP
            -- Crear notificación
            SP_NOTIFICAR_CAMBIO_PRECIO(v_cambios(i).id_arriendo, u.id_usuario,'habitacion', v_cambios(i).precio_old, v_cambios(i).precio_new);

        END LOOP;
    END LOOP;
    END AFTER STATEMENT;
END TRG_CAMBIO_PRECIO_HABITACION;