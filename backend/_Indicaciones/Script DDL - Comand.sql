DELIMITER $$

-- Garantiza la evolución del script sin fallas en despliegues futuros
DROP PROCEDURE IF EXISTS `SpProspectoRegistrarConsulta`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpProspectoRegistrarConsulta`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_apellido VARCHAR(100);
    DECLARE v_nombre VARCHAR(100);
    DECLARE v_razonSocial VARCHAR(150);
    DECLARE v_cargo VARCHAR(100);
    DECLARE v_email VARCHAR(150);
    DECLARE v_telefono VARCHAR(50);
    DECLARE v_mensaje TEXT;
    DECLARE v_existe INT DEFAULT 0;

    -- Manejo de excepciones por si algo falla en la transacción
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    -- Extraer valores del JSON con prefijo "p"
    SET v_id          = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_apellido    = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pApellido'));
    SET v_nombre      = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_razonSocial = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pRazonSocial'));
    SET v_cargo       = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCargo'));
    SET v_email       = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEmail'));
    SET v_telefono    = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTelefono'));
    SET v_mensaje     = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pMensaje'));

    -- Verificar si el ID existe en la tabla (si es que se envió uno válido)
    IF v_id IS NOT NULL AND v_id > 0 THEN
        SELECT COUNT(1) INTO v_existe FROM ProspectoConsultas WHERE Id = v_id;
    END IF;

    -- Lógica de negocio: INSERT o UPDATE
    IF v_existe > 0 THEN
        -- Actualizar registro existente
        UPDATE ProspectoConsultas 
        SET 
            Apellido = v_apellido, 
            Nombre = v_nombre, 
            RazonSocial = v_razonSocial, 
            Cargo = v_cargo, 
            Email = v_email, 
            Telefono = v_telefono, 
            Mensaje = v_mensaje
        WHERE Id = v_id;

        SET p_mensaje = 'Consulta actualizada con éxito!';
        SET p_json_result = JSON_OBJECT('id', v_id);
    ELSE
        -- Insertar nuevo registro
        INSERT INTO ProspectoConsultas (Apellido, Nombre, RazonSocial, Cargo, Email, Telefono, Mensaje)
        VALUES (v_apellido, v_nombre, v_razonSocial, v_cargo, v_email, v_telefono, v_mensaje);

        SET v_id = LAST_INSERT_ID();
        SET p_mensaje = 'Consulta enviada con éxito!';
        SET p_json_result = JSON_OBJECT('id', v_id);
    END IF;

    SET p_result = 1;

END$$

DELIMITER ;