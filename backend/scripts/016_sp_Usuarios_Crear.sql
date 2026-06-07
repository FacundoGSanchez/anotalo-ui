DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpUsuarios_Crear`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_username VARCHAR(100);
    DECLARE v_mail VARCHAR(150);
    DECLARE v_nombre VARCHAR(200);
    DECLARE v_rol VARCHAR(50);
    DECLARE v_passwordHash VARCHAR(255);

    SET v_username = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pUsername'));
    SET v_mail = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pMail'));
    SET v_nombre = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_rol = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pRol'));
    SET v_passwordHash = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pPasswordHash'));

    INSERT INTO Usuarios (Username, Mail, Nombre, Rol, PasswordHash)
    VALUES (v_username, v_mail, v_nombre, v_rol, v_passwordHash);

    SET p_result = 1;
    SET p_mensaje = 'Usuario creado con éxito';
    SET p_json_result = JSON_OBJECT('id', LAST_INSERT_ID());
END$$
DELIMITER ;
