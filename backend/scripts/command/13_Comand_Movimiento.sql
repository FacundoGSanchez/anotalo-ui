DELIMITER $$

DROP PROCEDURE IF EXISTS `SpMovimientoRegistrar`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpMovimientoRegistrar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id BIGINT;
    DECLARE v_tipo VARCHAR(20);
    DECLARE v_importe DECIMAL(12,2);
    DECLARE v_entidadId BIGINT;
    DECLARE v_entidadNombre VARCHAR(150);
    DECLARE v_fecha DATE;
    DECLARE v_hora VARCHAR(10);
    DECLARE v_usuarioId INT;
    DECLARE v_sucursalId INT;
    DECLARE v_saldoCtaCte DECIMAL(12,2);
    DECLARE v_observacion TEXT;
    DECLARE v_lineItems JSON;
    DECLARE v_formaPagos JSON;
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_itemCount INT;
    DECLARE v_itemImporte DECIMAL(12,2);
    DECLARE v_itemRubroId INT;
    DECLARE v_itemNombre VARCHAR(100);
    DECLARE v_existe INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_id          = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_tipo        = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTipo'));
    SET v_importe     = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pImporte'));
    SET v_entidadId   = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEntidadId'));
    SET v_entidadNombre = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEntidadNombre'));
    SET v_fecha       = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFecha'));
    SET v_hora        = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pHora'));
    SET v_usuarioId   = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pUsuarioId'));
    SET v_sucursalId  = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));
    SET v_saldoCtaCte = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSaldoCtaCte'));
    SET v_observacion = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pObservacion'));
    SET v_lineItems   = JSON_EXTRACT(p_parametros, '$.pLineItems');
    SET v_formaPagos  = JSON_EXTRACT(p_parametros, '$.pFormaPagos');

    IF v_fecha IS NULL THEN SET v_fecha = CURDATE(); END IF;
    IF v_hora IS NULL THEN SET v_hora = DATE_FORMAT(NOW(), '%H:%i'); END IF;

    IF v_id IS NOT NULL AND v_id > 0 THEN
        SELECT COUNT(1) INTO v_existe FROM Movimiento WHERE Id = v_id;
    END IF;

    IF v_existe > 0 THEN
        UPDATE Movimiento
        SET Tipo = v_tipo, Importe = v_importe,
            EntidadId = v_entidadId, EntidadNombre = v_entidadNombre,
            Fecha = v_fecha, Hora = v_hora, UsuarioId = v_usuarioId,
            SucursalId = v_sucursalId, SaldoCtaCte = v_saldoCtaCte,
            Observacion = v_observacion
        WHERE Id = v_id;

        DELETE FROM LineItem WHERE MovimientoId = v_id;
        DELETE FROM MovimientoFormaPago WHERE MovimientoId = v_id;

        SET p_mensaje = 'Movimiento actualizado con éxito';
    ELSE
        IF v_id IS NULL OR v_id <= 0 THEN
            SET v_id = UNIX_TIMESTAMP() * 1000 + FLOOR(RAND() * 1000);
        END IF;

        INSERT INTO Movimiento (Id, Tipo, Importe, EntidadId, EntidadNombre,
                                Fecha, Hora, UsuarioId, SucursalId, SaldoCtaCte, Observacion)
        VALUES (v_id, v_tipo, v_importe, v_entidadId, v_entidadNombre,
                v_fecha, v_hora, v_usuarioId, v_sucursalId, v_saldoCtaCte, v_observacion);

        SET p_mensaje = 'Movimiento creado con éxito';
    END IF;

    IF v_lineItems IS NOT NULL AND JSON_LENGTH(v_lineItems) > 0 THEN
        SET v_itemCount = JSON_LENGTH(v_lineItems);
        SET v_i = 0;

        WHILE v_i < v_itemCount DO
            SET v_itemImporte = JSON_UNQUOTE(JSON_EXTRACT(v_lineItems, CONCAT('$[', v_i, '].importe')));
            SET v_itemRubroId = JSON_UNQUOTE(JSON_EXTRACT(v_lineItems, CONCAT('$[', v_i, '].rubroId')));

            INSERT INTO LineItem (MovimientoId, Importe, RubroId)
            VALUES (v_id, v_itemImporte, v_itemRubroId);

            SET v_i = v_i + 1;
        END WHILE;
    END IF;

    IF v_formaPagos IS NOT NULL AND JSON_LENGTH(v_formaPagos) > 0 THEN
        SET v_itemCount = JSON_LENGTH(v_formaPagos);
        SET v_i = 0;

        WHILE v_i < v_itemCount DO
            SET v_itemNombre  = JSON_UNQUOTE(JSON_EXTRACT(v_formaPagos, CONCAT('$[', v_i, '].nombre')));
            SET v_itemImporte = JSON_UNQUOTE(JSON_EXTRACT(v_formaPagos, CONCAT('$[', v_i, '].importe')));

            INSERT INTO MovimientoFormaPago (MovimientoId, Nombre, Importe)
            VALUES (v_id, v_itemNombre, v_itemImporte);

            SET v_i = v_i + 1;
        END WHILE;
    END IF;

    SET p_json_result = JSON_OBJECT('id', v_id);
    SET p_result = 1;
END$$

DELIMITER ;
