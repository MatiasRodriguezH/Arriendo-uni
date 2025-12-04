CREATE OR REPLACE PROCEDURE GESTOR_CREAR_INMUEBLE (
    p_json_inmueble   IN CLOB,
    p_id_inmueble     OUT NUMBER
)
IS
    -- JSON general
    j_inmueble       JSON_OBJECT_T;
    j_imagenes       JSON_ARRAY_T;

    -- Dirección
    v_ciudad         VARCHAR2(200);
    v_id_region         NUMBER;
    v_calle          VARCHAR2(200);
    v_numero         VARCHAR2(50);
    v_latitud        NUMBER;
    v_longitud       NUMBER;
    v_adicional      VARCHAR2(250);

    v_id_ciudad      NUMBER;
    v_id_direccion   NUMBER;

    -- Inmueble
    v_tipo           VARCHAR2(50);
    v_modalidad      VARCHAR2(50);
    v_nombre         VARCHAR2(200);
    v_descripcion    VARCHAR2(500);
    v_propietario    NUMBER;
    v_arrendador     NUMBER;
    v_num_habs       NUMBER;
    v_num_banios     NUMBER;
    v_estado         VARCHAR2(30);
    v_origen_cont    VARCHAR2(30);
    v_telefono_cont  VARCHAR2(100);
    v_correo_cont    VARCHAR2(100);   

    -- Imagenes
    j_img            JSON_OBJECT_T;
    v_orden_img      NUMBER;
    v_ruta_img       VARCHAR2(300);

BEGIN
    -------------------------------------------------------------------
    -- PARSEAR JSON
    -------------------------------------------------------------------
    j_inmueble := JSON_OBJECT_T.parse(p_json_inmueble);

    v_ciudad      := j_inmueble.get_String('ciudad');
    v_id_region      := j_inmueble.get_Number('id_region');
    v_calle       := j_inmueble.get_String('calle');
    v_numero      := j_inmueble.get_String('numero');
    v_latitud     := j_inmueble.get_Number('latitud');
    v_longitud    := j_inmueble.get_Number('longitud');
    v_adicional   := j_inmueble.get_String('adicional');

    v_tipo           := j_inmueble.get_String('tipo_inmueble');
    v_modalidad      := j_inmueble.get_String('modalidad');
    v_nombre         := j_inmueble.get_String('nombre');
    v_propietario    := j_inmueble.get_Number('propietario');
    v_arrendador     := j_inmueble.get_Number('id_arrendador');
    v_descripcion    := j_inmueble.get_String('descripcion');
    v_num_habs       := j_inmueble.get_Number('num_habitaciones');
    v_num_banios     := j_inmueble.get_Number('num_banios');
    v_estado         := j_inmueble.get_String('estado');

    v_origen_cont    := j_inmueble.get_String('origen_contacto');
    v_telefono_cont  := j_inmueble.get_String('telefono_contacto');
    v_correo_cont    := j_inmueble.get_String('correo_contacto');

    -------------------------------------------------------------------
    -- 1. CREAR O OBTENER CIUDAD
    -------------------------------------------------------------------
    SELECT FN_EXIST_CIUDAD(v_ciudad, v_id_region)
    INTO v_id_ciudad
    FROM dual;

    IF v_id_ciudad IS NULL THEN
        CRUD_CIUDAD('I',v_id_ciudad,INITCAP(v_ciudad), v_id_region);
    END IF;

    -------------------------------------------------------------------
    -- 2. CREAR DIRECCIÓN
    -------------------------------------------------------------------
    SELECT FN_EXIST_DIRECCION(v_calle, v_numero, v_id_ciudad)
    INTO v_id_direccion
    FROM dual;

    IF v_id_direccion IS NULL THEN
        CRUD_DIRECCION('I',v_id_direccion,INITCAP(v_calle),v_numero,v_id_ciudad,v_latitud,v_longitud);
    END IF;

    -------------------------------------------------------------------
    -- 3. CREAR INMUEBLE
    -------------------------------------------------------------------
    CRUD_INMUEBLE( 'I', p_id_inmueble, v_tipo, v_modalidad, v_nombre, v_propietario, v_arrendador, v_descripcion, v_num_habs,
        v_num_banios, v_id_direccion, v_adicional, v_estado, v_origen_cont, v_telefono_cont, v_correo_cont);

    -------------------------------------------------------------------
    -- 4. INSERTAR IMÁGENES
    -------------------------------------------------------------------
    IF j_inmueble.has('imagenes') THEN
        j_imagenes := j_inmueble.get_Array('imagenes');

        FOR i IN 0 .. j_imagenes.get_size - 1 LOOP
            j_img := TREAT(j_imagenes.get(i) AS JSON_OBJECT_T);

            v_orden_img := j_img.get_Number('orden');
            v_ruta_img  := j_img.get_String('ruta');

            BEGIN
                CRUD_IMAGEN_INMUEBLE('I', NULL, p_id_inmueble, v_orden_img,v_ruta_img);
            END;
        END LOOP;

    END IF;
    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;


CREATE OR REPLACE PROCEDURE GESTOR_CREAR_ARRIENDO (
    p_id_inmueble    IN NUMBER,
    p_json_arriendo  IN CLOB,
    p_id_arriendo    OUT NUMBER
)
IS
    -- JSON principal
    j_arriendo        JSON_OBJECT_T;
    j_habitaciones    JSON_ARRAY_T;

    -- Campos del arriendo
    v_tipo_arriendo   VARCHAR2(50);
    v_titulo          VARCHAR2(250);
    v_precio          NUMBER;
    v_descripcion     VARCHAR2(500);
    v_estado          VARCHAR2(50);

    -- Variables para camas
    j_hab             JSON_OBJECT_T;

    v_nombre_hab      VARCHAR2(200);
    v_superficie_hab  NUMBER;
    v_desc_hab        VARCHAR2(500);
    v_precio_hab      NUMBER;
    v_img_hab         VARCHAR2(300);

BEGIN
    ----------------------------------------------------------------------
    -- PARSEAR JSON
    ----------------------------------------------------------------------
    j_arriendo := JSON_OBJECT_T.parse(p_json_arriendo);

    v_tipo_arriendo := j_arriendo.get_String('tipo_arriendo');
    v_titulo        := j_arriendo.get_String('titulo');
    v_precio        := j_arriendo.get_Number('precio');
    v_descripcion   := j_arriendo.get_String('descripcion');
    v_estado        := j_arriendo.get_String('estado');

    ----------------------------------------------------------------------
    -- 1. INSERTAR ARRIENDO (CRUD_ARRIENDO)
    ----------------------------------------------------------------------
    CRUD_ARRIENDO('I',p_id_arriendo, v_tipo_arriendo, v_titulo, p_id_inmueble, v_precio, v_descripcion, v_estado, SYSDATE);

    ----------------------------------------------------------------------
    -- 2. INSERTAR HABITACIONES (SI EL ARRIENDO ES POR HABITACIONES)
    ----------------------------------------------------------------------
    IF v_tipo_arriendo = 'por habitaciones'
       AND j_arriendo.has('habitaciones')
    THEN
        j_habitaciones := j_arriendo.get_Array('habitaciones');

        FOR i IN 0 .. j_habitaciones.get_size - 1 LOOP
            j_hab := TREAT(j_habitaciones.get(i) AS JSON_OBJECT_T);

            v_nombre_hab     := j_hab.get_String('nombre');
            v_superficie_hab := j_hab.get_Number('superficie');
            v_desc_hab       := j_hab.get_String('descripcion');
            v_precio_hab     := j_hab.get_Number('precio');
            v_img_hab        := j_hab.get_String('imagen_portada');

            --------------------------------------------------------------
            -- Insertar habitación
            --------------------------------------------------------------
            
            BEGIN
                CRUD_HABITACION('I', NULL, p_id_arriendo, v_nombre_hab, v_superficie_hab, v_desc_hab, v_precio_hab,v_img_hab);
            END;

        END LOOP;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;

