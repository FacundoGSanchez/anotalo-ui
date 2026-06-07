DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpEntidades_ObtenerTodos`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_tipo VARCHAR(20);
    DECLARE v_soloActivos TINYINT;
    DECLARE v_organizacionId INT;
    DECLARE v_sucursalId INT;

    SET v_tipo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTipo'));
    SET v_soloActivos = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSoloActivos'));
    SET v_organizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_sucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));

    IF v_soloActivos IS NULL THEN
        SET v_soloActivos = 1;
    END IF;

    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
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
        )
    ) INTO p_json_result
    FROM Entidades e
    WHERE (v_tipo IS NULL OR e.Tipo = v_tipo)
      AND (v_soloActivos = 0 OR e.Activo = 1)
      AND e.OrganizacionId = v_organizacionId
      AND (v_sucursalId IS NULL OR e.SucursalId = v_sucursalId)
    ORDER BY e.Nro ASC;

    SET p_result = 1;
    SET p_mensaje = 'Entidades obtenidas correctamente';
END$$
DELIMITER ;
