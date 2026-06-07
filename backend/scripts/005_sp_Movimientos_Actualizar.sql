DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpMovimientos_Actualizar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_tipo VARCHAR(50);
    DECLARE v_importe DECIMAL(18,2);
    DECLARE v_formaPago VARCHAR(50);
    DECLARE v_entidadId INT;
    DECLARE v_entidadNombre VARCHAR(200);
    DECLARE v_fecha DATE;
    DECLARE v_hora VARCHAR(10);
    DECLARE v_organizacionId INT;
    DECLARE v_sucursalId INT;

    SET v_id = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_tipo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTipo'));
    SET v_importe = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pImporte'));
    SET v_formaPago = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFormaPago'));
    SET v_entidadId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEntidadId'));
    SET v_entidadNombre = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEntidadNombre'));
    SET v_fecha = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFecha'));
    SET v_hora = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pHora'));
    SET v_organizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_sucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));

    UPDATE Movimientos
    SET Tipo = COALESCE(v_tipo, Tipo),
        Importe = COALESCE(v_importe, Importe),
        FormaPago = COALESCE(v_formaPago, FormaPago),
        EntidadId = COALESCE(v_entidadId, EntidadId),
        EntidadNombre = COALESCE(v_entidadNombre, EntidadNombre),
        Fecha = COALESCE(v_fecha, Fecha),
        Hora = COALESCE(v_hora, Hora),
        SucursalId = COALESCE(v_sucursalId, SucursalId)
    WHERE Id = v_id
      AND OrganizacionId = v_organizacionId;

    SET p_result = 1;
    SET p_mensaje = 'Movimiento actualizado con éxito';
    SET p_json_result = JSON_OBJECT('id', v_id);
END$$
DELIMITER ;
