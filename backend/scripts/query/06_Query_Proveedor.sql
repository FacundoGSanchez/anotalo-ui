DELIMITER $$

DROP PROCEDURE IF EXISTS `SpProveedorObtener`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpProveedorObtener`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id BIGINT;
    DECLARE v_nro INT;
    DECLARE v_nombre VARCHAR(150);
    DECLARE v_telefono VARCHAR(50);
    DECLARE v_activo TINYINT;
    DECLARE v_saldo DECIMAL(12,2);
    DECLARE v_fecha TIMESTAMP;
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE v_filtroId BIGINT;
    DECLARE v_filtroActivo INT;

    DECLARE cur CURSOR FOR
        SELECT Id, Nro, Nombre, Telefono, Activo, Saldo, FechaRegistro
        FROM Proveedor
        WHERE (v_filtroId IS NULL OR Id = v_filtroId)
          AND (v_filtroActivo IS NULL OR Activo = v_filtroActivo)
        ORDER BY Nombre;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_filtroId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_filtroActivo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pActivo'));

    SET p_json_result = JSON_ARRAY();

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_id, v_nro, v_nombre, v_telefono, v_activo, v_saldo, v_fecha;
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        SET p_json_result = JSON_ARRAY_APPEND(p_json_result, '$',
            JSON_OBJECT(
                'id', v_id,
                'nro', v_nro,
                'nombre', v_nombre,
                'telefono', v_telefono,
                'activo', v_activo,
                'saldo', v_saldo,
                'fechaRegistro', v_fecha
            )
        );
    END LOOP;
    CLOSE cur;

    SET p_result = 1;
    SET p_mensaje = 'Proveedores obtenidos correctamente';
END$$

DELIMITER ;
