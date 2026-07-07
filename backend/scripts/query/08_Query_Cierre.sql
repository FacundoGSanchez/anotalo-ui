DELIMITER $$

DROP PROCEDURE IF EXISTS `SpCierreObtener`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpCierreObtener`(
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
    DECLARE v_fechaReg TIMESTAMP;
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE v_filtroId BIGINT;
    DECLARE v_filtroSucursalId INT;
    DECLARE v_filtroFecha DATE;

    DECLARE cur CURSOR FOR
        SELECT c.Id, c.Fecha, c.Hora, c.Saldo, c.UsuarioId, c.SucursalId, c.FechaRegistro
        FROM Cierre c
        WHERE (v_filtroId IS NULL OR c.Id = v_filtroId)
          AND (v_filtroSucursalId IS NULL OR c.SucursalId = v_filtroSucursalId)
          AND (v_filtroFecha IS NULL OR c.Fecha = v_filtroFecha)
        ORDER BY c.Fecha DESC;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_filtroId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_filtroSucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));
    SET v_filtroFecha = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFecha'));

    SET p_json_result = JSON_ARRAY();

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_id, v_fecha, v_hora, v_saldo, v_usuarioId, v_sucursalId, v_fechaReg;
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        SET p_json_result = JSON_ARRAY_APPEND(p_json_result, '$',
            JSON_OBJECT(
                'id', v_id,
                'fecha', v_fecha,
                'hora', v_hora,
                'saldo', v_saldo,
                'usuarioId', v_usuarioId,
                'sucursalId', v_sucursalId,
                'fechaRegistro', v_fechaReg
            )
        );
    END LOOP;
    CLOSE cur;

    SET p_result = 1;
    SET p_mensaje = 'Cierres obtenidos correctamente';
END$$

DELIMITER ;
