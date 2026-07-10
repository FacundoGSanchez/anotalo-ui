DELIMITER $$

DROP PROCEDURE IF EXISTS `SpSucursalRegistrar`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpSucursalRegistrar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_organizacionId INT;
    DECLARE v_nombre VARCHAR(150);
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
    SET v_nombre          = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_activo          = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pActivo'));

    IF v_activo IS NULL THEN SET v_activo = 1; END IF;

    IF v_id IS NOT NULL AND v_id > 0 THEN
        SELECT COUNT(1) INTO v_existe FROM Sucursales WHERE Id = v_id;
    END IF;

    IF v_existe > 0 THEN
        UPDATE Sucursales
        SET OrganizacionId = v_organizacionId, Nombre = v_nombre, Activo = v_activo
        WHERE Id = v_id;

        SET p_mensaje = 'Sucursal actualizada con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    ELSE
        INSERT INTO Sucursales (OrganizacionId, Nombre, Activo)
        VALUES (v_organizacionId, v_nombre, v_activo);

        SET v_id = LAST_INSERT_ID();
        SET p_mensaje = 'Sucursal creada con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    END IF;

    SET p_result = 1;
END$$

DELIMITER ;
