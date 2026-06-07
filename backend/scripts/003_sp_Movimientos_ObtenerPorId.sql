DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpMovimientos_ObtenerPorId`(
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
        'Id', m.Id,
        'Tipo', m.Tipo,
        'Importe', m.Importe,
        'FormaPago', m.FormaPago,
        'EntidadId', m.EntidadId,
        'EntidadNombre', m.EntidadNombre,
        'EntidadNro', m.EntidadNro,
        'Fecha', m.Fecha,
        'Hora', m.Hora,
        'Usuario', m.Usuario,
        'Activo', m.Activo,
        'OrganizacionId', m.OrganizacionId,
        'SucursalId', m.SucursalId,
        'FechaRegistro', m.FechaRegistro
    ) INTO p_json_result
    FROM Movimientos m
    WHERE m.Id = v_id
      AND m.OrganizacionId = v_organizacionId;

    SET p_result = 1;
    SET p_mensaje = 'Movimiento obtenido correctamente';
END$$
DELIMITER ;
