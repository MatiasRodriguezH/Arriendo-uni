--ARCHIVO PARA CONSTRUIR TRIGGERS
--MATIAS RODRIGUEZ, JUAN ROJAS, ANGEL SILVA, MATIAS VALENZUELA

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

CREATE OR REPLACE TRIGGER TRG_CIUDAD_ID
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

CREATE OR REPLACE TRIGGER TRG_DIRECCION_ID
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

CREATE OR REPLACE TRIGGER TRG_INMUEBLE_ID
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

CREATE OR REPLACE TRIGGER TRG_ARRIENDO_ID
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

CREATE OR REPLACE TRIGGER TRG_HABITACION_ID
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

CREATE OR REPLACE TRIGGER TRG_IMAGEN_INMUEBLE_ID
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

CREATE OR REPLACE TRIGGER TRG_INSTITUCION_ID
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

CREATE OR REPLACE TRIGGER TRG_SEDE_INSTITUCION_ID
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

CREATE OR REPLACE TRIGGER TRG_REGION_ID
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

CREATE OR REPLACE TRIGGER TRG_UPDATE_ESTADO_INMUEBLE_INS
AFTER INSERT ON TCDB_ARRIENDO
FOR EACH ROW
BEGIN
    UPDATE TCDB_INMUEBLE
    SET estado = 'en arriendo'
    WHERE id_inmueble = :NEW.id_inmueble;
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


CREATE OR REPLACE TRIGGER TRG_SET_SEDE_MAS_CERCANA
BEFORE INSERT ON TCDB_INMUEBLE
FOR EACH ROW
DECLARE
  v_sede_id        NUMBER;
BEGIN
  -- Obtener la sede más cercana según las coordenadas de la dirección del inmueble
  SELECT id_sede
  INTO v_sede_id
  FROM (
        SELECT 
          si.id_sede AS id_sede,
          DISTANCIA_KM(
            (SELECT latitud  FROM TCDB_DIRECCION WHERE id_direccion = :NEW.id_direccion),
            (SELECT longitud FROM TCDB_DIRECCION WHERE id_direccion = :NEW.id_direccion),
            d.latitud,
            d.longitud
          ) AS distancia
        FROM TCDB_SEDE_INSTITUCION si
        JOIN TCDB_DIRECCION d
          ON si.id_direccion = d.id_direccion
        ORDER BY distancia ASC
       )
  WHERE ROWNUM = 1;

  -- Guardar en el inmueble antes de insertarlo
  :NEW.sede_cercana := v_sede_id;
END;

