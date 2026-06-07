DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpUsuarios_Actualizar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_mail VARCHAR(150);
    DECLARE v_nombre VARCHAR(200);
    DECLARE v_rol VARCHAR(50);
    DECLARE v_passwordHash VARCHAR(255);

    SET v_id = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_mail = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pMail'));
    SET v_nombre = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_rol = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pRol'));
    SET v_passwordHash = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pPasswordHash'));

    UPDATE Usuarios
    SET Mail = COALESCE(v_mail, Mail),
        Nombre = COALESCE(v_nombre, Nombre),
        Rol = COALESCE(v_rol, Rol),
        PasswordHash = COALESCE(v_passwordHash, PasswordHash)
    WHERE Id = v_id;

    SET p_result = 1;
    SET p_mensaje = 'Usuario actualizado con éxito';
    SET p_json_result = JSON_OBJECT('id', v_id);
END$$
DELIMITER ;
