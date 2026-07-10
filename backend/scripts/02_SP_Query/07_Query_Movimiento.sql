DELIMITER $$

DROP PROCEDURE IF EXISTS `SpMovimientoObtener`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpMovimientoObtener`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_tipo VARCHAR(20);
    DECLARE v_importe DECIMAL(12,2);
    DECLARE v_entidadId INT;
    DECLARE v_entidadNombre VARCHAR(150);
    DECLARE v_fechaReg TIMESTAMP;
    DECLARE v_usuarioId INT;
    DECLARE v_sucursalId INT;
    DECLARE v_organizacionId INT;
    DECLARE v_observacion TEXT;
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE v_filtroId INT;
    DECLARE v_filtroSucursalId INT;
    DECLARE v_filtroTipo VARCHAR(20);
    DECLARE v_filtroFechaDesde DATE;
    DECLARE v_filtroFechaHasta DATE;

    DECLARE cur CURSOR FOR
        SELECT m.Id, m.Tipo, m.ImporteTotal, m.EntidadId, m.EntidadNombre,
               m.FechaRegistro, m.UsuarioId, m.SucursalId, m.OrganizacionId, m.Observacion
        FROM Movimientos m
        WHERE (v_filtroId IS NULL OR m.Id = v_filtroId)
          AND (v_filtroSucursalId IS NULL OR m.SucursalId = v_filtroSucursalId)
          AND (v_filtroTipo IS NULL OR m.Tipo = v_filtroTipo)
          AND (v_filtroFechaDesde IS NULL OR DATE(m.FechaRegistro) >= v_filtroFechaDesde)
          AND (v_filtroFechaHasta IS NULL OR DATE(m.FechaRegistro) <= v_filtroFechaHasta)
        ORDER BY m.FechaRegistro DESC, m.Id DESC;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_filtroId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_filtroSucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));
    SET v_filtroTipo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTipo'));
    SET v_filtroFechaDesde = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFechaDesde'));
    SET v_filtroFechaHasta = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFechaHasta'));

    SET p_json_result = JSON_ARRAY();

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_id, v_tipo, v_importe, v_entidadId, v_entidadNombre,
                       v_fechaReg, v_usuarioId, v_sucursalId, v_organizacionId, v_observacion;
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        SET p_json_result = JSON_ARRAY_APPEND(p_json_result, '$',
            JSON_OBJECT(
                'id', v_id,
                'tipo', v_tipo,
                'importe', v_importe,
                'lineItems', COALESCE((
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', md.Id,
                            'importe', md.Importe,
                            'itemId', md.ItemId,
                            'itemDetalle', md.ItemDetalle
                        )
                    ) FROM MovimientoDetalle md
                    WHERE md.MovimientoId = v_id
                ), JSON_ARRAY()),
                'formaPagos', COALESCE((
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'nombre', fp.Nombre,
                            'importe', mfp.Importe
                        )
                    ) FROM MovimientoFormaPago mfp
                    INNER JOIN FormaPago fp ON fp.Id = mfp.FormaPagoId
                    WHERE mfp.MovimientoId = v_id
                ), JSON_ARRAY()),
                'entidad', JSON_OBJECT(
                    'id', v_entidadId,
                    'nombre', v_entidadNombre
                ),
                'fechaRegistro', v_fechaReg,
                'usuarioId', v_usuarioId,
                'sucursalId', v_sucursalId,
                'organizacionId', v_organizacionId,
                'observacion', v_observacion
            )
        );
    END LOOP;
    CLOSE cur;

    SET p_result = 1;
    SET p_mensaje = 'Movimientos obtenidos correctamente';
END$$

DELIMITER ;
