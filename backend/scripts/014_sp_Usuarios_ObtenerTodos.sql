DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpUsuarios_ObtenerTodos`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_soloActivos TINYINT;

    SET v_soloActivos = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSoloActivos'));

    IF v_soloActivos IS NULL THEN
        SET v_soloActivos = 1;
    END IF;

    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
            'Id', u.Id,
            'Username', u.Username,
            'Mail', u.Mail,
            'Nombre', u.Nombre,
            'Rol', u.Rol,
            'Activo', u.Activo,
            'FechaRegistro', u.FechaRegistro
        )
    ) INTO p_json_result
    FROM Usuarios u
    WHERE (v_soloActivos = 0 OR u.Activo = 1)
    ORDER BY u.Nombre ASC;

    SET p_result = 1;
    SET p_mensaje = 'Usuarios obtenidos correctamente';
END$$
DELIMITER ;
