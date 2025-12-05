--ARCHIVO PARA CONSTRUIR BASE DE DATO TCDB
--MATIAS RODRIGUEZ, JUAN ROJAS, ANGEL SILVA

--BORRADO DE TABLAS

DROP TABLE TCDB_Imagen;
DROP TABLE TCDB_Notificacion;
DROP TABLE TCDB_Interaccion;
DROP TABLE TCDB_Solicitud;
DROP TABLE TCDB_Habitacion;
DROP TABLE TCDB_Arriendo;
DROP TABLE TCDB_Inmueble;
DROP TABLE TCDB_Usuario;
DROP TABLE TCDB_Sede_Institucion;
DROP TABLE TCDB_Institucion;
DROP TABLE TCDB_Direccion;
DROP TABLE TCDB_Ciudad;
DROP TABLE TCDB_Region;

--CREACION DE TABLAS

CREATE TABLE TCDB_Region (
  id_region number,
  nombre varchar2(30),
  CONSTRAINT PK_TCDB_Region PRIMARY KEY (id_region)
);

CREATE TABLE TCDB_Ciudad (
  id_ciudad number,
  nombre varchar2(50),
  id_region number,
  CONSTRAINT PK_TCDB_Ciudad PRIMARY KEY (id_ciudad),
  CONSTRAINT FK_TCDB_Ciudad_id_region FOREIGN KEY (id_region)
    REFERENCES TCDB_Region(id_region)
);

CREATE TABLE TCDB_Direccion (
  id_direccion number,
  calle varchar2(50),
  numero number,
  ciudad number,
  latitud number,
  longitud number,
  CONSTRAINT PK_TCDB_Direccion PRIMARY KEY (id_direccion),
  CONSTRAINT FK_TCDB_Direccion_ciudad FOREIGN KEY (ciudad)
    REFERENCES TCDB_Ciudad(id_ciudad)
);

CREATE TABLE TCDB_Institucion (
  id_institucion number,
  nombre varchar2(60),
  tipo_institucion varchar2(30),
  CONSTRAINT PK_TCDB_Institucion PRIMARY KEY (id_institucion)
);

CREATE TABLE TCDB_Sede_Institucion (
  id_sede number,
  nombre varchar2(60),
  id_institucion number,
  id_direccion number,
  CONSTRAINT PK_TCDB_Sede_Institucion PRIMARY KEY (id_sede),
  CONSTRAINT FK_TCDB_Sede_Institucion_id_institucion FOREIGN KEY (id_institucion)
    REFERENCES TCDB_Institucion(id_institucion),
  CONSTRAINT FK_TCDB_Sede_Institucion_id_direccion FOREIGN KEY (id_direccion)
    REFERENCES TCDB_Direccion(id_direccion)
);

CREATE TABLE TCDB_Usuario (
  id_usuario number,
  rol_usuario varchar2(30),
  rut varchar2(11),
  nombre varchar2(40),
  apellido1 varchar2(30),
  apellido2 varchar2(30),
  correo varchar2(100),
  contrasenia varchar2(100),
  telefono varchar2(20),
  fecha_nacimiento date,
  genero varchar2(10),
  id_sede_institucion number,
  id_ciudad number,
  imagen_perfil varchar2(100),
  CONSTRAINT PK_TCDB_Usuario PRIMARY KEY (id_usuario),
  CONSTRAINT FK_TCDB_Usuario_id_sede_institucion FOREIGN KEY (id_sede_institucion)
    REFERENCES TCDB_Sede_Institucion(id_sede),
  CONSTRAINT FK_TCDB_Usuario_id_ciudad FOREIGN KEY (id_ciudad)
    REFERENCES TCDB_Ciudad(id_ciudad)
);

CREATE TABLE TCDB_Inmueble (
  id_inmueble number,
  tipo_inmueble varchar2(20),
  modalidad varchar2(20),
  nombre varchar2(40),
  propietario varchar2(50),
  id_arrendador number,
  descripcion varchar2(500),
  num_habitaciones number,
  num_banios number,
  id_direccion number,
  direccion_adicional varchar2(50),
  estado varchar2(20),
  origen_contacto varchar2(15),
  telefono_contacto varchar2(20),
  correo_contacto varchar2(100),
  CONSTRAINT PK_TCDB_Inmueble PRIMARY KEY (id_inmueble),
  CONSTRAINT FK_TCDB_Inmueble_id_direccion FOREIGN KEY (id_direccion)
    REFERENCES TCDB_Direccion(id_direccion),
  CONSTRAINT FK_TCDB_Inmueble_id_arrendador FOREIGN KEY (id_arrendador)
    REFERENCES TCDB_Usuario(id_usuario)
);

CREATE TABLE TCDB_Arriendo (
  id_arriendo number,
  tipo_arriendo varchar2(20),
  titulo varchar2(50),
  id_inmueble number,
  precio number,
  descripcion varchar2(200),
  estado varchar2(20),
  fecha date,
  CONSTRAINT PK_TCDB_Arriendo PRIMARY KEY (id_arriendo),
  CONSTRAINT FK_TCDB_Arriendo_id_inmueble FOREIGN KEY (id_inmueble)
    REFERENCES TCDB_Inmueble(id_inmueble)
);

CREATE TABLE TCDB_Habitacion (
  id_habitacion number,
  id_arriendo number,
  nombre varchar2(40),
  superficie number,
  descripcion varchar2(500),
  precio number,
  imagen_portada varchar2(100),
  CONSTRAINT PK_TCDB_Habitacion PRIMARY KEY (id_habitacion),
  CONSTRAINT FK_TCDB_Habitacion_id_arriendo FOREIGN KEY (id_arriendo)
    REFERENCES TCDB_Arriendo(id_arriendo)
);

CREATE TABLE TCDB_Solicitud (
  id_usuario number,
  id_arriendo number,
  estado_solicitud varchar2(30),
  fecha_hora date,
  CONSTRAINT PK_TCDB_Solicitud PRIMARY KEY (id_usuario, id_arriendo),
  CONSTRAINT FK_TCDB_Solicitud_id_arriendo FOREIGN KEY (id_arriendo)
    REFERENCES TCDB_Arriendo(id_arriendo),
  CONSTRAINT FK_TCDB_Solicitud_id_usuario FOREIGN KEY (id_usuario)
    REFERENCES TCDB_Usuario(id_usuario)
);

CREATE TABLE TCDB_Interaccion (
  id_usuario number,
  id_arriendo number,
  tipo_interaccion varchar2(20),
  fecha date,
  CONSTRAINT PK_TCDB_Interaccion PRIMARY KEY (id_usuario, id_arriendo),
  CONSTRAINT FK_TCDB_Interaccion_id_usuario FOREIGN KEY (id_usuario)
    REFERENCES TCDB_Usuario(id_usuario),
  CONSTRAINT FK_TCDB_Interaccion_id_arriendo FOREIGN KEY (id_arriendo)
    REFERENCES TCDB_Arriendo(id_arriendo)
);

CREATE TABLE TCDB_Notificacion (
  id_notiicacion number,
  id_usuario number,
  tipo_notificacion varchar2(20),
  titulo varchar2(50),
  mensaje varchar2(100),
  estado varchar2(20),
  enlace varchar2(100),
  fecha_hora date,
  CONSTRAINT PK_TCDB_Notificacion PRIMARY KEY (id_notiicacion),
  CONSTRAINT FK_TCDB_Notificacion_id_usuario FOREIGN KEY (id_usuario)
    REFERENCES TCDB_Usuario(id_usuario)
);

CREATE TABLE TCDB_Imagen_Inmueble (
  id_imagen number,
  id_inmueble number,
  orden_imagen number,
  nombre_imagen varchar2(100),
  CONSTRAINT PK_TCDB_Imagen PRIMARY KEY (id_imagen),
  CONSTRAINT FK_TCDB_Imagen_id_inmueble FOREIGN KEY (id_inmueble)
    REFERENCES TCDB_Inmueble(id_inmueble)
);

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

CREATE OR REPLACE FUNCTION DISTANCIA_KM (
  lat1 NUMBER, lon1 NUMBER,
  lat2 NUMBER, lon2 NUMBER
) RETURN NUMBER IS
  R CONSTANT NUMBER := 6371; -- radio de la Tierra en km
  PI CONSTANT NUMBER := ACOS(-1);
BEGIN
  RETURN R * 2 * ASIN(
    SQRT(
      POWER(SIN((lat2 - lat1) * PI / 180 / 2), 2) +
      COS(lat1 * PI / 180) * COS(lat2 * PI / 180) *
      POWER(SIN((lon2 - lon1) * PI / 180 / 2), 2)
    )
  );
END;
/

create or replace PROCEDURE SP_INSTITUCION_MAS_CERCANA (
  p_lat IN NUMBER,
  p_lng IN NUMBER,
  p_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
  OPEN p_cursor FOR
    SELECT 
      inst.id_institucion,
      inst.nombre,
      dist.latitud,
      dist.longitud,
      DISTANCIA_KM(p_lat, p_lng, dist.latitud, dist.longitud) AS distancia_km
    FROM TCDB_INSTITUCION inst
    JOIN TCDB_SEDE_INSTITUCION sede ON sede.id_institucion = inst.id_institucion
    JOIN TCDB_DIRECCION dist ON dist.id_direccion = sede.id_direccion
    ORDER BY distancia_km ASC
    FETCH FIRST 1 ROWS ONLY;
END;
/

ALTER TABLE TCDB_INMUEBLE
ADD SEDE_CERCANA varchar2(10); 

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
/

INSERT INTO TCDB_DIRECCION (id_direccion, calle, numero, id_ciudad, latitud, longitud) VALUES (
  3, 'San Miguel', 3846, 1, -35.43852218589199, -71.61795043362335
);

INSERT INTO TCDB_SEDE_INSTITUCION (id_sede, nombre, id_institucion, id_direccion) VALUES (4,'Campus Lircay', 31, 22);

INSERT INTO TCDB_SEDE_INSTITUCION (id_sede, nombre, id_institucion, id_direccion) VALUES (5,'Campus Pehuenche', 31, 3);

COMMIT;