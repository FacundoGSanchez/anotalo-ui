DELIMITER $$

DROP PROCEDURE IF EXISTS `SpLogin`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpLogin`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_username VARCHAR(50);
    DECLARE v_password VARCHAR(255);
    DECLARE v_usuario_id INT;
    DECLARE v_usuario_nombre VARCHAR(150);
    DECLARE v_usuario_mail VARCHAR(150);
    DECLARE v_usuario_username VARCHAR(50);
    DECLARE v_token VARCHAR(500);
    DECLARE v_session_id VARCHAR(100);
    DECLARE v_rol_nombre VARCHAR(100);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_username = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.username'));
    SET v_password = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.password'));

    SELECT u.Id, u.Nombre, u.Mail, u.Username
    INTO v_usuario_id, v_usuario_nombre, v_usuario_mail, v_usuario_username
    FROM Usuarios u
    WHERE u.Username = v_username AND u.Password = v_password AND u.Activo = 1;

    IF v_usuario_id IS NULL THEN
        SET p_result = 0;
        SET p_mensaje = 'Credenciales inválidas';
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', 'Credenciales inválidas');
    ELSE
        SET v_token = CONCAT('tok_', UUID());
        SET v_session_id = CONCAT('sess_', UNIX_TIMESTAMP(), '_', LOWER(SUBSTRING(UUID(), 1, 8)));

        SELECT r.Nombre INTO v_rol_nombre
        FROM UsuarioRol ur
        INNER JOIN Roles r ON r.Id = ur.RolId
        WHERE ur.UsuarioId = v_usuario_id
        LIMIT 1;

        SET p_json_result = JSON_OBJECT(
            'token', v_token,
            'sessionId', v_session_id,
            'usuario', JSON_OBJECT(
                'id', v_usuario_id,
                'username', v_usuario_username,
                'mail', v_usuario_mail,
                'nombre', v_usuario_nombre,
                'rol', v_rol_nombre,
                'roles', COALESCE((
                    SELECT JSON_ARRAYAGG(ur.RolId)
                    FROM UsuarioRol ur
                    WHERE ur.UsuarioId = v_usuario_id
                ), JSON_ARRAY())
            ),
            'organizaciones', COALESCE((
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', o.Id,
                        'nombre', o.Nombre,
                        'sucursalDefault', uo.OrganizacionDefault,
                        'FormasPago', JSON_OBJECT(
                            'Venta', COALESCE((
                                SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        'id', fp.Id,
                                        'nombre', fp.Nombre,
                                        'sigla', fp.Sigla,
                                        'requiereEntidad', fp.RequiereEntidad,
                                        'impactaCaja', fp.ImpactaCaja,
                                        'impactaCtaCte', fp.ImpactaCtaCte
                                    )
                                ) FROM FormaPago fp
                                WHERE fp.OrganizacionId = o.Id AND fp.Tipo = 'Venta' AND fp.Activo = 1
                            ), JSON_ARRAY()),
                            'Pago', COALESCE((
                                SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        'id', fp.Id,
                                        'nombre', fp.Nombre,
                                        'sigla', fp.Sigla,
                                        'requiereEntidad', fp.RequiereEntidad,
                                        'impactaCaja', fp.ImpactaCaja,
                                        'impactaCtaCte', fp.ImpactaCtaCte
                                    )
                                ) FROM FormaPago fp
                                WHERE fp.OrganizacionId = o.Id AND fp.Tipo = 'Pago' AND fp.Activo = 1
                            ), JSON_ARRAY()),
                            'Cobro', COALESCE((
                                SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                        'id', fp.Id,
                                        'nombre', fp.Nombre,
                                        'sigla', fp.Sigla,
                                        'requiereEntidad', fp.RequiereEntidad,
                                        'impactaCaja', fp.ImpactaCaja,
                                        'impactaCtaCte', fp.ImpactaCtaCte
                                    )
                                ) FROM FormaPago fp
                                WHERE fp.OrganizacionId = o.Id AND fp.Tipo = 'Cobro' AND fp.Activo = 1
                            ), JSON_ARRAY())
                        )
                    )
                ) FROM UsuarioOrganizacion uo
                INNER JOIN Organizaciones o ON o.Id = uo.OrganizacionId AND o.Activo = 1
                WHERE uo.UsuarioId = v_usuario_id
            ), JSON_ARRAY()),
            'rolesData', COALESCE((
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', r.Id,
                        'nombre', r.Nombre,
                        'permisos', COALESCE((
                            SELECT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'modulo', p.Modulo,
                                    'formulario', p.Formulario,
                                    'acciones', p.Acciones
                                )
                            ) FROM RolPermisos p WHERE p.RolId = r.Id
                        ), JSON_ARRAY())
                    )
                ) FROM Roles r WHERE r.Activo = 1
            ), JSON_ARRAY()),
            'sucursales', COALESCE((
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', s.Id,
                        'organizacionId', s.OrganizacionId,
                        'nombre', s.Nombre
                    )
                ) FROM Sucursales s WHERE s.Activo = 1
            ), JSON_ARRAY())
        );

        SET p_result = 1;
        SET p_mensaje = 'Login exitoso';
    END IF;
END$$

DELIMITER ;
