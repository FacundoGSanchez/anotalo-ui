DELIMITER $$

DROP PROCEDURE IF EXISTS `SpDashboardObtener`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpDashboardObtener`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_sucursalId INT;
    DECLARE v_fecha DATE;

    DECLARE v_totalVentas DECIMAL(12,2) DEFAULT 0;
    DECLARE v_totalPagos DECIMAL(12,2) DEFAULT 0;
    DECLARE v_totalCobros DECIMAL(12,2) DEFAULT 0;
    DECLARE v_totalIngresos DECIMAL(12,2) DEFAULT 0;
    DECLARE v_totalRetiros DECIMAL(12,2) DEFAULT 0;
    DECLARE v_cantMovimientos INT DEFAULT 0;
    DECLARE v_cantClientes INT DEFAULT 0;
    DECLARE v_cantProveedores INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_sucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));
    SET v_fecha = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFecha'));

    IF v_fecha IS NULL THEN
        SET v_fecha = CURDATE();
    END IF;

    SELECT COALESCE(SUM(Importe), 0) INTO v_totalVentas
    FROM Movimiento
    WHERE Tipo = 'Venta'
      AND (v_sucursalId IS NULL OR SucursalId = v_sucursalId)
      AND Fecha = v_fecha;

    SELECT COALESCE(SUM(Importe), 0) INTO v_totalPagos
    FROM Movimiento
    WHERE Tipo = 'Pago'
      AND (v_sucursalId IS NULL OR SucursalId = v_sucursalId)
      AND Fecha = v_fecha;

    SELECT COALESCE(SUM(Importe), 0) INTO v_totalCobros
    FROM Movimiento
    WHERE Tipo = 'Cobro'
      AND (v_sucursalId IS NULL OR SucursalId = v_sucursalId)
      AND Fecha = v_fecha;

    SELECT COALESCE(SUM(Importe), 0) INTO v_totalIngresos
    FROM Movimiento
    WHERE Tipo = 'Ingreso'
      AND (v_sucursalId IS NULL OR SucursalId = v_sucursalId)
      AND Fecha = v_fecha;

    SELECT COALESCE(SUM(Importe), 0) INTO v_totalRetiros
    FROM Movimiento
    WHERE Tipo = 'Retiro'
      AND (v_sucursalId IS NULL OR SucursalId = v_sucursalId)
      AND Fecha = v_fecha;

    SELECT COUNT(1) INTO v_cantMovimientos
    FROM Movimiento
    WHERE (v_sucursalId IS NULL OR SucursalId = v_sucursalId)
      AND Fecha = v_fecha;

    SELECT COUNT(1) INTO v_cantClientes FROM Cliente WHERE Activo = 1;
    SELECT COUNT(1) INTO v_cantProveedores FROM Proveedor WHERE Activo = 1;

    SET p_json_result = JSON_OBJECT(
        'resumen', JSON_OBJECT(
            'totalVentas', v_totalVentas,
            'totalPagos', v_totalPagos,
            'totalCobros', v_totalCobros,
            'totalIngresos', v_totalIngresos,
            'totalRetiros', v_totalRetiros,
            'cantMovimientos', v_cantMovimientos,
            'cantClientes', v_cantClientes,
            'cantProveedores', v_cantProveedores
        )
    );

    SET p_result = 1;
    SET p_mensaje = 'Dashboard obtenido correctamente';
END$$

DELIMITER ;
