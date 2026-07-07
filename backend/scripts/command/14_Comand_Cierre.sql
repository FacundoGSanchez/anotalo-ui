DELIMITER $$

DROP PROCEDURE IF EXISTS `SpCierreRegistrar`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpCierreRegistrar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id BIGINT;
    DECLARE v_fecha DATE;
    DECLARE v_hora VARCHAR(10);
    DECLARE v_saldo DECIMAL(12,2);
    DECLARE v_usuarioId INT;
    DECLARE v_sucursalId INT;
    DECLARE v_existe INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_id          = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_fecha       = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFecha'));
    SET v_hora        = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pHora'));
    SET v_saldo       = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSaldo'));
    SET v_usuarioId   = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pUsuarioId'));
    SET v_sucursalId  = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));

    IF v_fecha IS NULL THEN SET v_fecha = CURDATE(); END IF;
    IF v_hora IS NULL THEN SET v_hora = DATE_FORMAT(NOW(), '%H:%i'); END IF;

    IF v_id IS NOT NULL AND v_id > 0 THEN
        SELECT COUNT(1) INTO v_existe FROM Cierre WHERE Id = v_id;
    END IF;

    IF v_existe > 0 THEN
        UPDATE Cierre
        SET Fecha = v_fecha, Hora = v_hora, Saldo = v_saldo,
            UsuarioId = v_usuarioId, SucursalId = v_sucursalId
        WHERE Id = v_id;

        SET p_mensaje = 'Cierre actualizado con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    ELSE
        IF v_id IS NULL OR v_id <= 0 THEN
            SET v_id = UNIX_TIMESTAMP() * 1000 + FLOOR(RAND() * 1000);
        END IF;

        INSERT INTO Cierre (Id, Fecha, Hora, Saldo, UsuarioId, SucursalId)
        VALUES (v_id, v_fecha, v_hora, v_saldo, v_usuarioId, v_sucursalId);

        SET p_mensaje = 'Cierre creado con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    END IF;

    SET p_result = 1;
END$$

DELIMITER ;
