--ARCHIVO PARA CONSTRUIR GESTORES
--MATIAS RODRIGUEZ, JUAN ROJAS, ANGEL SILVA, MATIAS VALENZUELA


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
    v_propietario    VARCHAR2(50);
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
    v_propietario    := j_inmueble.get_String('propietario');
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

CREATE OR REPLACE PROCEDURE GESTOR_CREAR_USUARIO (
    p_json_usuario IN CLOB,
    p_id_usuario   OUT NUMBER
)
IS
    -- JSON
    j_user JSON_OBJECT_T;

    -- campos
    v_rol_usuario      VARCHAR2(50);
    v_rut              VARCHAR2(20);
    v_nombre           VARCHAR2(100);
    v_apellido1        VARCHAR2(100);
    v_apellido2        VARCHAR2(100);
    v_correo           VARCHAR2(200);
    v_contrasenia      VARCHAR2(200);
    v_telefono         VARCHAR2(50);
    v_fecha_nacimiento DATE;
    v_genero           VARCHAR2(20);
    v_id_sede_inst     NUMBER;
    v_ciudad           VARCHAR2(100);
    v_id_region        NUMBER;
    v_id_ciudad        NUMBER;
    v_imagen_perfil    VARCHAR2(300);

    v_count NUMBER;

BEGIN
    ----------------------------------------------------------------------
    -- 1. PARSEAR JSON
    ----------------------------------------------------------------------
    j_user := JSON_OBJECT_T.parse(p_json_usuario);

    v_rol_usuario      := j_user.get_String('rol');
    v_rut              := j_user.get_String('rut');
    v_nombre           := j_user.get_String('nombre');
    v_apellido1        := j_user.get_String('apellido1');
    v_apellido2        := j_user.get_String('apellido2');
    v_correo           := j_user.get_String('correo');
    v_contrasenia      := j_user.get_String('contrasenia');
    v_telefono         := j_user.get_String('telefono');
    v_fecha_nacimiento := TO_DATE(j_user.get_String('fecha_nacimiento'), 'YYYY-MM-DD');
    v_genero           := j_user.get_String('genero');
    v_id_sede_inst     := j_user.get_Number('id_sede_inst');
    v_ciudad           := j_user.get_String('ciudad');
    v_id_region        := j_user.get_Number('id_region');
    v_imagen_perfil    := j_user.get_String('imagen_perfil');

    ----------------------------------------------------------------------
    -- 2. VALIDAR DUPLICADOS (correo o rut)
    ----------------------------------------------------------------------
    SELECT COUNT(*) INTO v_count 
    FROM TCDB_USUARIO 
    WHERE correo = v_correo OR rut = v_rut;

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20030, 'El correo o rut ya se encuentra registrado.');
    END IF;

    ----------------------------------------------------------------------
    -- 3. INSERTAR CIUDAD SI ES ARRENDADOR
    ----------------------------------------------------------------------
    IF v_rol_usuario = 'arrendador' THEN
        SELECT FN_EXIST_CIUDAD(v_ciudad, v_id_region)
        INTO v_id_ciudad
        FROM DUAL;

        IF v_id_ciudad IS NULL THEN
            CRUD_CIUDAD('I', v_id_ciudad, INITCAP(v_ciudad), v_id_region);
        END IF;
    ELSE
        v_id_ciudad := NULL;
    END IF;

    ----------------------------------------------------------------------
    -- 4. INSERTAR USUARIO
    ----------------------------------------------------------------------
    CRUD_USUARIO('I', p_id_usuario, v_rol_usuario, v_rut, v_nombre, v_apellido1, v_apellido2, v_correo, v_contrasenia,
        v_telefono, v_fecha_nacimiento, v_genero, v_id_sede_inst, v_id_ciudad, v_imagen_perfil);

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;

CREATE OR REPLACE PROCEDURE GESTOR_EDITAR_INMUEBLE (
    p_json_inmueble IN CLOB
)
IS
    j_inmueble       JSON_OBJECT_T;
    j_imgs      JSON_ARRAY_T;

    -- dirección
    v_id_direccion NUMBER;
    v_adicional  VARCHAR2(300);

    -- inmueble
    v_id_inmueble       NUMBER;
    v_tipo_inmueble     VARCHAR2(50);
    v_modalidad         VARCHAR2(50);
    v_nombre            VARCHAR2(200);
    v_propietario       VARCHAR2(200);
    v_id_arrendador     NUMBER;
    v_descripcion       VARCHAR2(500);
    v_num_habitaciones  NUMBER;
    v_num_banios        NUMBER;
    v_estado            VARCHAR2(50);

    -- imágenes
    j_img JSON_OBJECT_T;
    v_orden NUMBER;
    v_ruta   VARCHAR2(300);
    v_id_img NUMBER;

BEGIN
    ------------------------------------------------------------------
    -- PARSEAR JSON
    ------------------------------------------------------------------
    j_inmueble := JSON_OBJECT_T.parse(p_json_inmueble);
    v_id_inmueble := j_inmueble.get_Number('id_inmueble');
    j_imgs := j_inmueble.get_Array('imagenes');

    ------------------------------------------------------------------
    -- 2. ACTUALIZAR INMUEBLE
    ------------------------------------------------------------------
    v_tipo_inmueble    := j_inmueble.get_String('tipo_inmueble');
    v_modalidad        := j_inmueble.get_String('modalidad');
    v_nombre           := j_inmueble.get_String('nombre');
    v_propietario      := j_inmueble.get_String('propietario');
    v_id_arrendador    := j_inmueble.get_Number('id_arrendador');
    v_descripcion      := j_inmueble.get_String('descripcion');
    v_num_habitaciones := j_inmueble.get_Number('num_habitaciones');
    v_num_banios       := j_inmueble.get_Number('num_banios');
    v_id_direccion     := j_inmueble.get_Number('id_direccion');
    v_adicional        := j_inmueble.get_String('adicional');
    v_estado           := j_inmueble.get_String('estado');

    CRUD_INMUEBLE(
        'U',
        v_id_inmueble,
        v_tipo_inmueble,
        v_modalidad,
        v_nombre,
        v_propietario,
        v_id_arrendador,
        v_descripcion,
        v_num_habitaciones,
        v_num_banios,
        v_id_direccion,
        v_adicional,
        v_estado,
        j_inmueble.get_String('origen_contacto'),
        j_inmueble.get_String('telefono_contacto'),
        j_inmueble.get_String('correo_contacto')
    );

    ------------------------------------------------------------------
    -- 5. LIMPIAR TODAS LAS IMÁGENES EXISTENTES EN DB
    ------------------------------------------------------------------
    DELETE FROM TCDB_IMAGEN_INMUEBLE
    WHERE id_inmueble = v_id_inmueble;

    ------------------------------------------------------------------
    -- 6. REINSERTAR TODAS LAS IMÁGENES DESDE JSON
    ------------------------------------------------------------------
    FOR i IN 0 .. j_imgs.get_size - 1 LOOP
        j_img := TREAT(j_imgs.get(i) AS JSON_OBJECT_T);

        v_orden := j_img.get_Number('orden');
        v_ruta := j_img.get_String('ruta');

        v_id_img := NULL;
        IF j_img.has('id') THEN
            v_id_img := j_img.get_Number('id');
        END IF;

        CRUD_IMAGEN_INMUEBLE('I', v_id_img, v_id_inmueble, v_orden, v_ruta);
    END LOOP;

    EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;

CREATE OR REPLACE PROCEDURE GESTOR_EDITAR_ARRIENDO (
    p_json_arriendo IN CLOB
)
IS
    j_arriendo JSON_OBJECT_T;
    j_habitaciones JSON_ARRAY_T;
    j_hab JSON_OBJECT_T;

    -- Datos del arriendo
    v_id_arriendo      NUMBER;
    v_tipo_arriendo    VARCHAR2(50);
    v_titulo      VARCHAR2(200);
    v_id_inmueble      NUMBER;
    v_precio      NUMBER;
    v_descripcion VARCHAR2(1000);
    v_estado      VARCHAR2(50);

    -- Habitaciones
    v_id_hab      NUMBER;
    v_nombre      VARCHAR2(200);
    v_superficie  NUMBER;
    v_des_hab     VARCHAR2(500);
    v_precio_hab  NUMBER;
    v_img         VARCHAR2(400);

BEGIN
    ----------------------------------------------------------------------
    -- Parseo del JSON
    ----------------------------------------------------------------------
    j_arriendo  := JSON_OBJECT_T.parse(p_json_arriendo);
    j_habitaciones := j_arriendo.get_Array('habitaciones');

    ----------------------------------------------------------------------
    -- Leer datos del arriendo
    ----------------------------------------------------------------------
    v_id_arriendo      := j_arriendo.get_Number('id_arriendo');
    v_tipo_arriendo    := j_arriendo.get_String('tipo_arriendo');
    v_titulo      := j_arriendo.get_String('titulo');
    v_id_inmueble      := j_arriendo.get_Number('id_inmueble');
    v_precio      := j_arriendo.get_Number('precio');
    v_descripcion := j_arriendo.get_String('descripcion');
    v_estado      := 'disponible';

    ----------------------------------------------------------------------
    -- 1. Actualizar arriendo
    ----------------------------------------------------------------------
    CRUD_ARRIENDO('U',v_id_arriendo, v_tipo_arriendo, v_titulo, v_id_inmueble, v_precio, v_descripcion, v_estado, SYSDATE);
    CRUD_INMUEBLE( p_operacion => 'U', p_id_inmueble => v_id_inmueble, p_modalidad => v_tipo_arriendo);

    ----------------------------------------------------------------------
    -- 3. Actualizar o insertar habitaciones
    ----------------------------------------------------------------------
    FOR i IN 0 .. j_habitaciones.get_size - 1 LOOP
        j_hab := TREAT(j_habitaciones.get(i) AS JSON_OBJECT_T);

        v_id_hab     := CASE WHEN j_hab.has('id') THEN j_hab.get_Number('id') ELSE NULL END;
        v_nombre     := j_hab.get_String('nombre');
        v_superficie := j_hab.get_Number('superficie');
        v_des_hab    := j_hab.get_String('descripcion');
        v_precio_hab := j_hab.get_Number('precio');
        v_img        := j_hab.get_String('imagen_portada');

        IF v_id_hab IS NULL THEN
            -- Insertar nueva habitación
            CRUD_HABITACION('I', v_id_hab, v_id_arriendo, v_nombre, v_superficie, v_des_hab, v_precio_hab, v_img);
        ELSE
            -- Actualizar habitación existente
            CRUD_HABITACION('U',v_id_hab, v_id_arriendo, v_nombre, v_superficie, v_des_hab, v_precio_hab,v_img);
        END IF;

    END LOOP;
    
    EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;


CREATE OR REPLACE PROCEDURE GESTOR_CREAR_SOLICITUD (
    p_id_usuario      IN  NUMBER,
    p_id_arriendo     IN  NUMBER
)
IS
    v_estado VARCHAR2(30) := 'en espera';
BEGIN
    ------------------------------------------------------------------
    -- 1. CREAR SOLICITUD
    ------------------------------------------------------------------
    CRUD_SOLICITUD('I', p_id_usuario, p_id_arriendo, v_estado, SYSDATE);

    ------------------------------------------------------------------
    -- 2. CREAR NOTIFICACIÓN DE CONTACTO POR SOLICITUD
    ------------------------------------------------------------------
    SP_NOTIFICAR_SOLICITUD_CONTACTO(p_id_arriendo, p_id_usuario);

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;

CREATE OR REPLACE PROCEDURE GESTOR_EDITAR_SOLICITUD (
    p_id_usuario      IN  NUMBER,
    p_id_arrendador   IN  NUMBER,
    p_id_arriendo     IN  NUMBER,
    modo              IN  VARCHAR2
)
IS
BEGIN
    ------------------------------------------------------------------
    -- 1. CONSULTAR Y ACTUALIZAR ESTADO DE SOLICITUD
    ------------------------------------------------------------------

    IF p_id_usuario IS NULL AND p_id_arriendo IS NULL THEN

       FOR a IN (SELECT id_arriendo FROM TCDB_ARRIENDO a
        JOIN TCDB_INMUEBLE i ON a.id_inmueble = i.id_inmueble
        WHERE i.id_arrendador = p_id_arrendador
        )
        LOOP
            FOR s IN (SELECT id_usuario FROM TCDB_SOLICITUD
                WHERE id_arriendo = a.id_arriendo AND estado_solicitud = 'pendiente'
            )
            LOOP
                CRUD_SOLICITUD('U', s.id_usuario, a.id_arriendo, modo);
            END LOOP;
        END LOOP;

    ELSE 
        CRUD_SOLICITUD('U', p_id_usuario, p_id_arriendo, modo);
    END IF;

    ------------------------------------------------------------------
    -- 2. CREAR NOTIFICACIÓN DE CONTACTO POR SOLICITUD
    ------------------------------------------------------------------
    SP_NOTIFICAR_RESPUESTA_SOLICITUD(p_id_arriendo, p_id_usuario, modo);

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;

