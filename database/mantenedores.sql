
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
    p_id_ciudad        IN NUMBER DEFAULT NULL
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
            id_sede_institucion, id_ciudad
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
            p_id_ciudad
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
            id_ciudad           = p_id_ciudad
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