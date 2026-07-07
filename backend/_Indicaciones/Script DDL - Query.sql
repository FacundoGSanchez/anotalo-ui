DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpProspectoObtenerConsultas`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_id INT;
    DECLARE v_apellido VARCHAR(100);
    DECLARE v_nombre VARCHAR(100);
    DECLARE v_razonSocial VARCHAR(150);
    DECLARE v_cargo VARCHAR(100);
    DECLARE v_email VARCHAR(150);
    DECLARE v_telefono VARCHAR(50);
    DECLARE v_mensaje TEXT;
    DECLARE v_fecha TIMESTAMP;

    DECLARE cur CURSOR FOR
        SELECT Id, Apellido, Nombre, RazonSocial, Cargo, Email, Telefono, Mensaje, FechaRegistro
        FROM ProspectoConsultas;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    SET p_json_result = JSON_ARRAY();

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_id, v_apellido, v_nombre, v_razonSocial, v_cargo, v_email, v_telefono, v_mensaje, v_fecha;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SET p_json_result = JSON_ARRAY_APPEND(p_json_result, '$',
            JSON_OBJECT(
                'Id', v_id,
                'Apellido', v_apellido,
                'Nombre', v_nombre,
                'RazonSocial', v_razonSocial,
                'Cargo', v_cargo,
                'Email', v_email,
                'Telefono', v_telefono,
                'Mensaje', v_mensaje,
                'FechaRegistro', v_fecha
            )
        );
    END LOOP;
    CLOSE cur;

    SET p_result = 1;
    SET p_mensaje = 'Consultas obtenidas correctamente';
END$$
DELIMITER ;
