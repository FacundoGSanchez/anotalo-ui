DELIMITER $$

DROP PROCEDURE IF EXISTS `SpUsuarioObtener`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpUsuarioObtener`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_username VARCHAR(50);
    DECLARE v_mail VARCHAR(150);
    DECLARE v_nombre VARCHAR(150);
    DECLARE v_activo TINYINT;
    DECLARE v_fecha TIMESTAMP;
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE v_filtroId INT;
    DECLARE v_filtroActivo INT;

    DECLARE cur CURSOR FOR
        SELECT u.Id, u.Username, u.Mail, u.Nombre, u.Activo, u.FechaRegistro
        FROM UsuarioSistema u
        WHERE (v_filtroId IS NULL OR u.Id = v_filtroId)
          AND (v_filtroActivo IS NULL OR u.Activo = v_filtroActivo)
        ORDER BY u.Nombre;

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
        FETCH cur INTO v_id, v_username, v_mail, v_nombre, v_activo, v_fecha;
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        SET p_json_result = JSON_ARRAY_APPEND(p_json_result, '$',
            JSON_OBJECT(
                'id', v_id,
                'username', v_username,
                'mail', v_mail,
                'nombre', v_nombre,
                'activo', v_activo,
                'roles', COALESCE((
                    SELECT JSON_ARRAYAGG(ur.RolId)
                    FROM UsuarioRol ur
                    WHERE ur.UsuarioId = v_id
                ), JSON_ARRAY()),
                'sucursales', COALESCE((
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', s.Id,
                            'organizacionId', s.OrganizacionId,
                            'nombre', s.Nombre
                        )
                    ) FROM UsuarioSucursal us
                    INNER JOIN Sucursal s ON s.Id = us.SucursalId
                    WHERE us.UsuarioId = v_id
                ), JSON_ARRAY()),
                'fechaRegistro', v_fecha
            )
        );
    END LOOP;
    CLOSE cur;

    SET p_result = 1;
    SET p_mensaje = 'Usuarios obtenidos correctamente';
END$$

DROP PROCEDURE IF EXISTS `SpRolObtener`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpRolObtener`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_nombre VARCHAR(100);
    DECLARE v_activo TINYINT;
    DECLARE v_fecha TIMESTAMP;
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE v_filtroId INT;

    DECLARE cur CURSOR FOR
        SELECT r.Id, r.Nombre, r.Activo, r.FechaRegistro
        FROM Rol r
        WHERE (v_filtroId IS NULL OR r.Id = v_filtroId)
        ORDER BY r.Nombre;

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
        FETCH cur INTO v_id, v_nombre, v_activo, v_fecha;
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        SET p_json_result = JSON_ARRAY_APPEND(p_json_result, '$',
            JSON_OBJECT(
                'id', v_id,
                'nombre', v_nombre,
                'activo', v_activo,
                'permisos', COALESCE((
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'modulo', p.Modulo,
                            'formulario', p.Formulario,
                            'acciones', p.Acciones
                        )
                    ) FROM Permiso p WHERE p.RolId = v_id
                ), JSON_ARRAY()),
                'fechaRegistro', v_fecha
            )
        );
    END LOOP;
    CLOSE cur;

    SET p_result = 1;
    SET p_mensaje = 'Roles obtenidos correctamente';
END$$

DELIMITER ;
