--ARCHIVO PARA CONSTRUIR FUNCIONES
--MATIAS RODRIGUEZ, JUAN ROJAS, ANGEL SILVA, MATIAS VALENZUELA


CREATE OR REPLACE FUNCTION FN_EXIST_CIUDAD (
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

CREATE OR REPLACE FUNCTION FN_EXIST_DIRECCION (
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