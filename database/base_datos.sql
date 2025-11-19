--ARCHIVO PARA CONSTRUIR BASE DE DATO TCDB
--MATIAS RODRIGUEZ, JUAN ROJAS, ANGEL SILVA

--BORRADO DE TABLAS

DROP TABLE TCDB_Imagen;
DROP TABLE TCDB_Notificacion;
DROP TABLE TCDB_Interaccion;
DROP TABLE TCDB_Solicitud;
DROP TABLE TCDB_Arriendo;
DROP TABLE TCDB_Habitacion;
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

CREATE TABLE TCDB_Habitacion (
  id_habitacion number,
  nombre varchar2(40),
  superficie number,
  descripcion varchar2(500),
  id_inmueble number,
  imagen_portada varchar2(100),
  CONSTRAINT PK_TCDB_Habitacion PRIMARY KEY (id_habitacion),
  CONSTRAINT FK_TCDB_Habitacion_id_inmueble FOREIGN KEY (id_inmueble)
    REFERENCES TCDB_Inmueble(id_inmueble)
);

CREATE TABLE TCDB_Unidad_Arriendo (
  id_unidad_arriendo number,
  id_inmueble number,
  id_habitacion number,
  CONSTRAINT PK_TCDB_Unidad_Arriendo PRIMARY KEY (id_unidad_arriendo),
  CONSTRAINT FK_TCDB_Unidad_Arriendo_id_inmueble FOREIGN KEY (id_inmueble)
    REFERENCES TCDB_Inmueble(id_inmueble),
  CONSTRAINT FK_TCDB_Unidad_Arriendo_id_habitacion FOREIGN KEY (id_habitacion)
    REFERENCES TCDB_Habitacion(id_habitacion)
);

CREATE TABLE TCDB_Arriendo (
  id_arriendo number,
  tipo_arriendo varchar2(20),
  titulo varchar2(50),
  id_unidad_arriendo number,
  precio number,
  descripcion varchar2(200),
  estado varchar2(20),
  fecha date,
  CONSTRAINT PK_TCDB_Arriendo PRIMARY KEY (id_arriendo),
  CONSTRAINT FK_TCDB_Arriendo_id_unidad FOREIGN KEY (id_unidad_arriendo)
    REFERENCES TCDB_Unidad_Arriendo(id_unidad_arriendo)
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
  titulo varchar2(30),
  mensaje varchar2(50),
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

INSERT INTO TCDB_REGION VALUES(1,'Maule');
INSERT INTO TCDB_CIUDAD VALUES(1,'Talca',1);
INSERT INTO TCDB_DIRECCION VALUES(1,'Avenida San Miguel',3605,1);
INSERT INTO TCDB_INSTITUCION VALUES(1,'Universidad Católica del Maule','universidad');
INSERT INTO TCDB_SEDE_INSTITUCION VALUES(1,'SEDE SAN MIGUEL',1,1);

INSERT INTO TCDB_USUARIO VALUES(1,'estudiante','27142629-1','Angel','Silva','Arias','angeleduardosilvaarias@gmail.com','12345678',null,'20/02/2005','masculino',1,null,null);
INSERT INTO TCDB_USUARIO VALUES(2,'arrendador','99999999-9','Arrendador','Numero','Uno','angeleduardosilvaarias@gmail.com','12345678',null,'31/12/1999','masculino',null,null,1);

INSERT INTO TCDB_INMUEBLE VALUES(1,'casa','por completo','Casa de Prueba','Arrendador Numero Uno',2,'Esta es una descripcion de la Casa de Prueba',3,1,1,'a un lado de la universidad','disponible','arrendador',null,null);
INSERT INTO TCDB_UNIDAD_ARRIENDO VALUES(1,1,null);
INSERT INTO TCDB_ARRIENDO VALUES(1,'por completo','Arriendo Casa de Prueba',1,300000,'Esta es una descripcion del arriendo','disponible',SYSDATE);