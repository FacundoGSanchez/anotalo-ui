DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpEntidades_Crear`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_tipo VARCHAR(20);
    DECLARE v_nro INT;
    DECLARE v_nombre VARCHAR(200);
    DECLARE v_telefono VARCHAR(50);
    DECLARE v_cuit VARCHAR(20);
    DECLARE v_saldo DECIMAL(18,2);
    DECLARE v_organizacionId INT;
    DECLARE v_sucursalId INT;

    SET v_tipo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTipo'));
    SET v_nombre = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_telefono = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTelefono'));
    SET v_cuit = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCuit'));
    SET v_saldo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSaldo'));
    SET v_organizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_sucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));

    SELECT COALESCE(MAX(Nro), 0) + 1 INTO v_nro
    FROM Entidades WHERE Tipo = v_tipo AND OrganizacionId = v_organizacionId;

    INSERT INTO Entidades (Tipo, Nro, Nombre, Telefono, Cuit, Saldo, OrganizacionId, SucursalId)
    VALUES (v_tipo, v_nro, v_nombre, v_telefono, v_cuit, COALESCE(v_saldo, 0), v_organizacionId, v_sucursalId);

    SET p_result = 1;
    SET p_mensaje = 'Entidad creada con éxito';
    SET p_json_result = JSON_OBJECT('id', LAST_INSERT_ID(), 'nro', v_nro);
END$$
DELIMITER ;
