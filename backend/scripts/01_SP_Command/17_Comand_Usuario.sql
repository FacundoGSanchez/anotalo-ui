DELIMITER $$

DROP PROCEDURE IF EXISTS `SpUsuarioRegistrar`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpUsuarioRegistrar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_username VARCHAR(50);
    DECLARE v_password VARCHAR(255);
    DECLARE v_mail VARCHAR(150);
    DECLARE v_nombre VARCHAR(150);
    DECLARE v_activo TINYINT;
    DECLARE v_roles JSON;
    DECLARE v_sucursales JSON;
    DECLARE v_existe INT DEFAULT 0;
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_itemCount INT;
    DECLARE v_rolId INT;
    DECLARE v_sucursalId INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_id        = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_username  = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pUsername'));
    SET v_password  = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pPassword'));
    SET v_mail      = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pMail'));
    SET v_nombre    = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_activo    = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pActivo'));
    SET v_roles     = JSON_EXTRACT(p_parametros, '$.pRoles');
    SET v_sucursales = JSON_EXTRACT(p_parametros, '$.pSucursales');

    IF v_activo IS NULL THEN SET v_activo = 1; END IF;

    IF v_id IS NOT NULL AND v_id > 0 THEN
        SELECT COUNT(1) INTO v_existe FROM Usuarios WHERE Id = v_id;
    END IF;

    IF v_existe > 0 THEN
        UPDATE Usuarios
        SET Username = v_username, Mail = v_mail, Nombre = v_nombre, Activo = v_activo
        WHERE Id = v_id;

        IF v_password IS NOT NULL AND v_password != '' THEN
            UPDATE Usuarios SET Password = v_password WHERE Id = v_id;
        END IF;

        DELETE FROM UsuarioRol WHERE UsuarioId = v_id;
        DELETE FROM UsuarioSucursal WHERE UsuarioId = v_id;

        SET p_mensaje = 'Usuario actualizado con éxito';
    ELSE
        INSERT INTO Usuarios (Username, Password, Mail, Nombre, Activo)
        VALUES (v_username, v_password, v_mail, v_nombre, v_activo);

        SET v_id = LAST_INSERT_ID();
        SET p_mensaje = 'Usuario creado con éxito';
    END IF;

    IF v_roles IS NOT NULL AND JSON_LENGTH(v_roles) > 0 THEN
        SET v_itemCount = JSON_LENGTH(v_roles);
        SET v_i = 0;

        WHILE v_i < v_itemCount DO
            SET v_rolId = JSON_UNQUOTE(JSON_EXTRACT(v_roles, CONCAT('$[', v_i, ']')));
            INSERT INTO UsuarioRol (UsuarioId, RolId) VALUES (v_id, v_rolId);
            SET v_i = v_i + 1;
        END WHILE;
    END IF;

    IF v_sucursales IS NOT NULL AND JSON_LENGTH(v_sucursales) > 0 THEN
        SET v_itemCount = JSON_LENGTH(v_sucursales);
        SET v_i = 0;

        WHILE v_i < v_itemCount DO
            SET v_sucursalId = JSON_UNQUOTE(JSON_EXTRACT(v_sucursales, CONCAT('$[', v_i, ']')));
            INSERT INTO UsuarioSucursal (UsuarioId, SucursalId) VALUES (v_id, v_sucursalId);
            SET v_i = v_i + 1;
        END WHILE;
    END IF;

    SET p_json_result = JSON_OBJECT('id', v_id);
    SET p_result = 1;
END$$

DELIMITER ;
