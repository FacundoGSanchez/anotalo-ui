DELIMITER $$

DROP PROCEDURE IF EXISTS `SpFormaPagoRegistrar`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpFormaPagoRegistrar`(
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
    DECLARE v_existe INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_id                = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_organizacionId    = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_tipo              = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTipo'));
    SET v_nombre            = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_sigla             = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSigla'));
    SET v_requiereEntidad   = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pRequiereEntidad'));
    SET v_impactaCaja       = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pImpactaCaja'));
    SET v_impactaCtaCte     = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pImpactaCtaCte'));
    SET v_activo            = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pActivo'));

    IF v_requiereEntidad IS NULL THEN SET v_requiereEntidad = 0; END IF;
    IF v_impactaCaja IS NULL THEN SET v_impactaCaja = 1; END IF;
    IF v_impactaCtaCte IS NULL THEN SET v_impactaCtaCte = 0; END IF;
    IF v_activo IS NULL THEN SET v_activo = 1; END IF;

    IF v_id IS NOT NULL AND v_id > 0 THEN
        SELECT COUNT(1) INTO v_existe FROM FormaPago WHERE Id = v_id;
    END IF;

    IF v_existe > 0 THEN
        UPDATE FormaPago
        SET OrganizacionId = v_organizacionId, Tipo = v_tipo, Nombre = v_nombre,
            Sigla = v_sigla, RequiereEntidad = v_requiereEntidad,
            ImpactaCaja = v_impactaCaja, ImpactaCtaCte = v_impactaCtaCte, Activo = v_activo
        WHERE Id = v_id;

        SET p_mensaje = 'Forma de pago actualizada con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    ELSE
        INSERT INTO FormaPago (OrganizacionId, Tipo, Nombre, Sigla, RequiereEntidad, ImpactaCaja, ImpactaCtaCte, Activo)
        VALUES (v_organizacionId, v_tipo, v_nombre, v_sigla, v_requiereEntidad, v_impactaCaja, v_impactaCtaCte, v_activo);

        SET v_id = LAST_INSERT_ID();
        SET p_mensaje = 'Forma de pago creada con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    END IF;

    SET p_result = 1;
END$$

DROP PROCEDURE IF EXISTS `SpRubroRegistrar`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpRubroRegistrar`(
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
    DECLARE v_existe INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_id              = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_organizacionId  = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_sigla           = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSigla'));
    SET v_nombre          = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_grupo           = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pGrupo'));
    SET v_activo          = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pActivo'));

    IF v_activo IS NULL THEN SET v_activo = 1; END IF;

    IF v_id IS NOT NULL AND v_id > 0 THEN
        SELECT COUNT(1) INTO v_existe FROM Rubro WHERE Id = v_id;
    END IF;

    IF v_existe > 0 THEN
        UPDATE Rubro
        SET OrganizacionId = v_organizacionId, Sigla = v_sigla, Nombre = v_nombre,
            Grupo = v_grupo, Activo = v_activo
        WHERE Id = v_id;

        SET p_mensaje = 'Rubro actualizado con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    ELSE
        INSERT INTO Rubro (OrganizacionId, Sigla, Nombre, Grupo, Activo)
        VALUES (v_organizacionId, v_sigla, v_nombre, v_grupo, v_activo);

        SET v_id = LAST_INSERT_ID();
        SET p_mensaje = 'Rubro creado con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    END IF;

    SET p_result = 1;
END$$

DROP PROCEDURE IF EXISTS `SpConfigPOSRegistrar`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpConfigPOSRegistrar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_organizacionId INT;
    DECLARE v_usaRubro TINYINT;
    DECLARE v_existe INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_id              = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_organizacionId  = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_usaRubro        = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pUsaRubro'));

    IF v_usaRubro IS NULL THEN SET v_usaRubro = 1; END IF;

    IF v_id IS NOT NULL AND v_id > 0 THEN
        SELECT COUNT(1) INTO v_existe FROM ConfigPOS WHERE Id = v_id;
    END IF;

    IF v_existe > 0 THEN
        UPDATE ConfigPOS
        SET OrganizacionId = v_organizacionId, UsaRubro = v_usaRubro
        WHERE Id = v_id;

        SET p_mensaje = 'Config POS actualizada con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    ELSE
        INSERT INTO ConfigPOS (OrganizacionId, UsaRubro)
        VALUES (v_organizacionId, v_usaRubro);

        SET v_id = LAST_INSERT_ID();
        SET p_mensaje = 'Config POS creada con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    END IF;

    SET p_result = 1;
END$$

DELIMITER ;
