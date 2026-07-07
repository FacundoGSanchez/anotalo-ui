DELIMITER $$

DROP PROCEDURE IF EXISTS `SpOrganizacionObtener`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpOrganizacionObtener`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_nombre VARCHAR(150);
    DECLARE v_sucursalDefault INT;
    DECLARE v_tiposMovimiento JSON;
    DECLARE v_activo TINYINT;
    DECLARE v_fecha TIMESTAMP;
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE v_filtroId INT;

    DECLARE cur CURSOR FOR
        SELECT Id, Nombre, SucursalDefault, TiposMovimiento, Activo, FechaRegistro
        FROM Organizacion
        WHERE (v_filtroId IS NULL OR Id = v_filtroId)
        ORDER BY Nombre;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_filtroId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));

    SET p_json_result = JSON_ARRAY();

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_id, v_nombre, v_sucursalDefault, v_tiposMovimiento, v_activo, v_fecha;
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        SET p_json_result = JSON_ARRAY_APPEND(p_json_result, '$',
            JSON_OBJECT(
                'id', v_id,
                'nombre', v_nombre,
                'sucursalDefault', v_sucursalDefault,
                'TiposMovimiento', v_tiposMovimiento,
                'activo', v_activo,
                'fechaRegistro', v_fecha
            )
        );
    END LOOP;
    CLOSE cur;

    SET p_result = 1;
    SET p_mensaje = 'Organizaciones obtenidas correctamente';
END$$

DELIMITER ;
