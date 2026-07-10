DELIMITER $$

DROP PROCEDURE IF EXISTS `SpProveedorRegistrar`$$

CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpProveedorRegistrar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_nombre VARCHAR(150);
    DECLARE v_telefono VARCHAR(50);
    DECLARE v_mail VARCHAR(150);
    DECLARE v_activo TINYINT;
    DECLARE v_existe INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_mensaje = MESSAGE_TEXT;
        SET p_result = 0;
        SET p_json_result = JSON_OBJECT('success', FALSE, 'error', p_mensaje);
    END;

    SET v_id       = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_nombre   = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_telefono = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTelefono'));
    SET v_mail     = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pMail'));
    SET v_activo   = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pActivo'));

    IF v_activo IS NULL THEN SET v_activo = 1; END IF;

    IF v_id IS NOT NULL AND v_id > 0 THEN
        SELECT COUNT(1) INTO v_existe FROM Proveedores WHERE Id = v_id;
    END IF;

    IF v_existe > 0 THEN
        UPDATE Proveedores
        SET Nombre = v_nombre, Telefono = v_telefono, Mail = v_mail, Activo = v_activo
        WHERE Id = v_id;

        SET p_mensaje = 'Proveedor actualizado con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    ELSE
        IF v_id IS NULL OR v_id <= 0 THEN
            SET v_id = UNIX_TIMESTAMP() * 1000 + FLOOR(RAND() * 1000);
        END IF;

        INSERT INTO Proveedores (Id, Nombre, Telefono, Mail, Activo)
        VALUES (v_id, v_nombre, v_telefono, v_mail, v_activo);

        SET p_mensaje = 'Proveedor creado con éxito';
        SET p_json_result = JSON_OBJECT('id', v_id);
    END IF;

    SET p_result = 1;
END$$

DELIMITER ;
