DELIMITER $$

DROP PROCEDURE IF EXISTS `SpFormaPagoObtener`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpFormaPagoObtener`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_organizacionId INT;
    DECLARE v_tipo VARCHAR(20);
    DECLARE v_nombre VARCHAR(100);
    DECLARE v_sigla VARCHAR(10);
    DECLARE v_requiereEntidad TINYINT;
    DECLARE v_impactaCaja TINYINT;
    DECLARE v_impactaCtaCte TINYINT;
    DECLARE v_activo TINYINT;
    DECLARE v_fecha TIMESTAMP;
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE v_filtroId INT;
    DECLARE v_filtroOrganizacionId INT;
    DECLARE v_filtroTipo VARCHAR(20);

    DECLARE cur CURSOR FOR
        SELECT Id, OrganizacionId, Tipo, Nombre, Sigla, RequiereEntidad, ImpactaCaja, ImpactaCtaCte, Activo, FechaRegistro
        FROM FormaPago
        WHERE (v_filtroId IS NULL OR Id = v_filtroId)
          AND (v_filtroOrganizacionId IS NULL OR OrganizacionId = v_filtroOrganizacionId)
          AND (v_filtroTipo IS NULL OR Tipo = v_filtroTipo)
        ORDER BY Tipo, Nombre;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_filtroId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_filtroOrganizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_filtroTipo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTipo'));

    SET p_json_result = JSON_ARRAY();

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_id, v_organizacionId, v_tipo, v_nombre, v_sigla,
                       v_requiereEntidad, v_impactaCaja, v_impactaCtaCte, v_activo, v_fecha;
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        SET p_json_result = JSON_ARRAY_APPEND(p_json_result, '$',
            JSON_OBJECT(
                'id', v_id,
                'organizacionId', v_organizacionId,
                'tipo', v_tipo,
                'nombre', v_nombre,
                'sigla', v_sigla,
                'requiereEntidad', v_requiereEntidad,
                'impactaCaja', v_impactaCaja,
                'impactaCtaCte', v_impactaCtaCte,
                'activo', v_activo,
                'fechaRegistro', v_fecha
            )
        );
    END LOOP;
    CLOSE cur;

    SET p_result = 1;
    SET p_mensaje = 'Formas de pago obtenidas correctamente';
END$$

DROP PROCEDURE IF EXISTS `SpRubroObtener`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpRubroObtener`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_organizacionId INT;
    DECLARE v_sigla VARCHAR(10);
    DECLARE v_nombre VARCHAR(100);
    DECLARE v_grupo VARCHAR(100);
    DECLARE v_activo TINYINT;
    DECLARE v_fecha TIMESTAMP;
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE v_filtroId INT;
    DECLARE v_filtroOrganizacionId INT;

    DECLARE cur CURSOR FOR
        SELECT Id, OrganizacionId, Sigla, Nombre, Grupo, Activo, FechaRegistro
        FROM Rubro
        WHERE (v_filtroId IS NULL OR Id = v_filtroId)
          AND (v_filtroOrganizacionId IS NULL OR OrganizacionId = v_filtroOrganizacionId)
        ORDER BY Grupo, Nombre;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_filtroId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_filtroOrganizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));

    SET p_json_result = JSON_ARRAY();

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_id, v_organizacionId, v_sigla, v_nombre, v_grupo, v_activo, v_fecha;
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        SET p_json_result = JSON_ARRAY_APPEND(p_json_result, '$',
            JSON_OBJECT(
                'id', v_id,
                'organizacionId', v_organizacionId,
                'sigla', v_sigla,
                'nombre', v_nombre,
                'grupo', v_grupo,
                'activo', v_activo,
                'fechaRegistro', v_fecha
            )
        );
    END LOOP;
    CLOSE cur;

    SET p_result = 1;
    SET p_mensaje = 'Rubros obtenidos correctamente';
END$$

DROP PROCEDURE IF EXISTS `SpConfigPOSObtener`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpConfigPOSObtener`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_organizacionId INT;
    DECLARE v_usaRubro TINYINT;
    DECLARE v_fecha TIMESTAMP;
    DECLARE v_done INT DEFAULT FALSE;

    DECLARE v_filtroId INT;
    DECLARE v_filtroOrganizacionId INT;

    DECLARE cur CURSOR FOR
        SELECT Id, OrganizacionId, UsaRubro, FechaRegistro
        FROM ConfigPOS
        WHERE (v_filtroId IS NULL OR Id = v_filtroId)
          AND (v_filtroOrganizacionId IS NULL OR OrganizacionId = v_filtroOrganizacionId);

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_filtroId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_filtroOrganizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));

    SET p_json_result = JSON_ARRAY();

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_id, v_organizacionId, v_usaRubro, v_fecha;
        IF v_done THEN
            LEAVE read_loop;
        END IF;

        SET p_json_result = JSON_ARRAY_APPEND(p_json_result, '$',
            JSON_OBJECT(
                'id', v_id,
                'organizacionId', v_organizacionId,
                'usaRubro', v_usaRubro,
                'fechaRegistro', v_fecha
            )
        );
    END LOOP;
    CLOSE cur;

    SET p_result = 1;
    SET p_mensaje = 'Configuracion POS obtenida correctamente';
END$$

DELIMITER ;
