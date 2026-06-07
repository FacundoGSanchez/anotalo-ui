DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpEntidades_Actualizar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_nombre VARCHAR(200);
    DECLARE v_telefono VARCHAR(50);
    DECLARE v_cuit VARCHAR(20);
    DECLARE v_saldo DECIMAL(18,2);
    DECLARE v_organizacionId INT;
    DECLARE v_sucursalId INT;

    SET v_id = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_nombre = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_telefono = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTelefono'));
    SET v_cuit = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCuit'));
    SET v_saldo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSaldo'));
    SET v_organizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_sucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));

    UPDATE Entidades
    SET Nombre = COALESCE(v_nombre, Nombre),
        Telefono = COALESCE(v_telefono, Telefono),
        Cuit = COALESCE(v_cuit, Cuit),
        Saldo = COALESCE(v_saldo, Saldo),
        SucursalId = COALESCE(v_sucursalId, SucursalId)
    WHERE Id = v_id
      AND OrganizacionId = v_organizacionId;

    SET p_result = 1;
    SET p_mensaje = 'Entidad actualizada con éxito';
    SET p_json_result = JSON_OBJECT('id', v_id);
END$$
DELIMITER ;
