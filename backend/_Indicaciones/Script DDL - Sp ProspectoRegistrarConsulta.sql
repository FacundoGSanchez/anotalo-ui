DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpProspectoRegistrarConsulta`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_apellido VARCHAR(100);
    DECLARE v_nombre VARCHAR(100);
    DECLARE v_razonSocial VARCHAR(150);
    DECLARE v_cargo VARCHAR(100);
    DECLARE v_email VARCHAR(150);
    DECLARE v_telefono VARCHAR(50);
    DECLARE v_mensaje TEXT;

    -- Extraer valores del JSON con prefijo "p"
    SET v_apellido     = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pApellido'));
    SET v_nombre       = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_razonSocial  = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pRazonSocial'));
    SET v_cargo        = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCargo'));
    SET v_email        = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEmail'));
    SET v_telefono     = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTelefono'));
    SET v_mensaje      = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pMensaje'));

    -- Insertar en la tabla
    INSERT INTO ProspectoConsultas (Apellido, Nombre, RazonSocial, Cargo, Email, Telefono, Mensaje)
    VALUES (v_apellido, v_nombre, v_razonSocial, v_cargo, v_email, v_telefono, v_mensaje);

    -- Resultado de salida
    SET p_result = 1;
    SET p_mensaje = 'Consulta enviada con éxito!';
    SET p_json_result = JSON_OBJECT('id', LAST_INSERT_ID());
END$$
DELIMITER ;
