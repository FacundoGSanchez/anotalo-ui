DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpMovimientos_Eliminar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_organizacionId INT;

    SET v_id = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_organizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));

    DELETE FROM Movimientos WHERE Id = v_id AND OrganizacionId = v_organizacionId;

    SET p_result = 1;
    SET p_mensaje = 'Movimiento eliminado con éxito';
    SET p_json_result = JSON_OBJECT('id', v_id);
END$$
DELIMITER ;
