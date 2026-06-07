DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpMovimientos_Crear`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_tipo VARCHAR(50);
    DECLARE v_importe DECIMAL(18,2);
    DECLARE v_formaPago VARCHAR(50);
    DECLARE v_entidadId INT;
    DECLARE v_entidadNombre VARCHAR(200);
    DECLARE v_entidadNro INT;
    DECLARE v_fecha DATE;
    DECLARE v_hora VARCHAR(10);
    DECLARE v_usuario VARCHAR(100);
    DECLARE v_organizacionId INT;
    DECLARE v_sucursalId INT;

    SET v_tipo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTipo'));
    SET v_importe = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pImporte'));
    SET v_formaPago = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFormaPago'));
    SET v_entidadId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEntidadId'));
    SET v_entidadNombre = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEntidadNombre'));
    SET v_entidadNro = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEntidadNro'));
    SET v_fecha = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFecha'));
    SET v_hora = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pHora'));
    SET v_usuario = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pUsuario'));
    SET v_organizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_sucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));

    INSERT INTO Movimientos (Tipo, Importe, FormaPago, EntidadId, EntidadNombre, EntidadNro, Fecha, Hora, Usuario, OrganizacionId, SucursalId)
    VALUES (v_tipo, v_importe, COALESCE(v_formaPago, 'Efectivo'), v_entidadId, v_entidadNombre, v_entidadNro, v_fecha, v_hora, v_usuario, v_organizacionId, v_sucursalId);

    SET p_result = 1;
    SET p_mensaje = 'Movimiento creado con éxito';
    SET p_json_result = JSON_OBJECT('id', LAST_INSERT_ID());
END$$
DELIMITER ;
