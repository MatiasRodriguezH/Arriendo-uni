--ARCHIVO PARA CONSTRUIR TABLAS DE LA BASE DE DATOS
--MATIAS RODRIGUEZ, JUAN ROJAS, ANGEL SILVA, MATIAS VALENZUELA

--BORRADO DE TABLAS

DROP TABLE TCDB_IMAGEN_INMUEBLE;
DROP TABLE TCDB_NOTIFICACION;
DROP TABLE TCDB_INTERACCION;
DROP TABLE TCDB_SOLICITUD;
DROP TABLE TCDB_HABITACION;
DROP TABLE TCDB_ARRIENDO;
DROP TABLE TCDB_INMUEBLE;
DROP TABLE TCDB_USUARIO;
DROP TABLE TCDB_SEDE_INSTITUCION;
DROP TABLE TCDB_INSTITUCION;
DROP TABLE TCDB_DIRECCION;
DROP TABLE TCDB_CIUDAD;
DROP TABLE TCDB_REGION;

--CREACION DE TABLAS

CREATE TABLE TCDB_REGION (
  id_region number,
  nombre varchar2(30),
  CONSTRAINT PK_TCDB_Region PRIMARY KEY (id_region)
);

CREATE TABLE TCDB_CIUDAD (
  id_ciudad number,
  nombre varchar2(50),
  id_region number,
  CONSTRAINT PK_TCDB_Ciudad PRIMARY KEY (id_ciudad),
  CONSTRAINT FK_TCDB_Ciudad_id_region FOREIGN KEY (id_region)
    REFERENCES TCDB_Region(id_region)
);

CREATE TABLE TCDB_DIRECCION (
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

CREATE TABLE TCDB_INSTITUCION (
  id_institucion number,
  nombre varchar2(60),
  tipo_institucion varchar2(30),
  CONSTRAINT PK_TCDB_Institucion PRIMARY KEY (id_institucion)
);

CREATE TABLE TCDB_SEDE_INSTITUCION (
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

CREATE TABLE TCDB_USUARIO (
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

CREATE TABLE TCDB_INMUEBLE (
  id_inmueble number,
  tipo_inmueble varchar2(20),
  modalidad varchar2(20),
  nombre varchar2(50),
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
  sede_cercana number
  CONSTRAINT PK_TCDB_Inmueble PRIMARY KEY (id_inmueble),
  CONSTRAINT FK_TCDB_Inmueble_id_direccion FOREIGN KEY (id_direccion)
    REFERENCES TCDB_Direccion(id_direccion),
  CONSTRAINT FK_TCDB_Inmueble_id_arrendador FOREIGN KEY (id_arrendador)
    REFERENCES TCDB_Usuario(id_usuario),
  CONSTRAINT FK_TCDB_Inmueble_sede_cercana FOREIGN KEY (sede_cercana)
    REFERENCES TCDB_SEDE_INSTITUCION(id_sede)
);

CREATE TABLE TCDB_ARRIENDO (
  id_arriendo number,
  tipo_arriendo varchar2(20),
  titulo varchar2(100),
  id_inmueble number,
  precio number,
  descripcion varchar2(500),
  estado varchar2(20),
  fecha date,
  CONSTRAINT PK_TCDB_Arriendo PRIMARY KEY (id_arriendo),
  CONSTRAINT FK_TCDB_Arriendo_id_inmueble FOREIGN KEY (id_inmueble)
    REFERENCES TCDB_Inmueble(id_inmueble)
);

CREATE TABLE TCDB_HABITACION (
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

CREATE TABLE TCDB_SOLICITUD (
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

CREATE TABLE TCDB_INTERACCION (
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

CREATE TABLE TCDB_NOTIFICACION (
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

CREATE TABLE TCDB_IMAGEN_INMUEBLE (
  id_imagen number,
  id_inmueble number,
  orden_imagen number,
  nombre_imagen varchar2(100),
  CONSTRAINT PK_TCDB_Imagen PRIMARY KEY (id_imagen),
  CONSTRAINT FK_TCDB_Imagen_id_inmueble FOREIGN KEY (id_inmueble)
    REFERENCES TCDB_Inmueble(id_inmueble)
);