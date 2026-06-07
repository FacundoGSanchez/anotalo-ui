DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpUsuarios_Eliminar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;

    SET v_id = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));

    UPDATE Usuarios SET Activo = 0 WHERE Id = v_id;

    SET p_result = 1;
    SET p_mensaje = 'Usuario desactivado con éxito';
    SET p_json_result = JSON_OBJECT('id', v_id);
END$$
DELIMITER ;
