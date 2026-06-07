DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpEntidades_ObtenerPorId`(
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

    SELECT JSON_OBJECT(
        'Id', e.Id,
        'Tipo', e.Tipo,
        'Nro', e.Nro,
        'Nombre', e.Nombre,
        'Telefono', e.Telefono,
        'Cuit', e.Cuit,
        'Saldo', e.Saldo,
        'Activo', e.Activo,
        'OrganizacionId', e.OrganizacionId,
        'SucursalId', e.SucursalId,
        'FechaAlta', e.FechaAlta
    ) INTO p_json_result
    FROM Entidades e
    WHERE e.Id = v_id
      AND e.OrganizacionId = v_organizacionId;

    SET p_result = 1;
    SET p_mensaje = 'Entidad obtenida correctamente';
END$$
DELIMITER ;
