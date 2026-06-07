DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpUsuarios_ObtenerPorId`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;

    SET v_id = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));

    SELECT JSON_OBJECT(
        'Id', u.Id,
        'Username', u.Username,
        'Mail', u.Mail,
        'Nombre', u.Nombre,
        'Rol', u.Rol,
        'Activo', u.Activo,
        'FechaRegistro', u.FechaRegistro
    ) INTO p_json_result
    FROM Usuarios u
    WHERE u.Id = v_id;

    SET p_result = 1;
    SET p_mensaje = 'Usuario obtenido correctamente';
END$$
DELIMITER ;
