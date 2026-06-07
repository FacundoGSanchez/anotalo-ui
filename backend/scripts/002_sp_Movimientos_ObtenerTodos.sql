DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpMovimientos_ObtenerTodos`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_filtro_tipo VARCHAR(50);
    DECLARE v_filtro_fecha_desde DATE;
    DECLARE v_filtro_fecha_hasta DATE;
    DECLARE v_organizacionId INT;
    DECLARE v_sucursalId INT;
    DECLARE v_soloActivos TINYINT;

    SET v_filtro_tipo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTipo'));
    SET v_filtro_fecha_desde = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFechaDesde'));
    SET v_filtro_fecha_hasta = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFechaHasta'));
    SET v_organizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_sucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));
    SET v_soloActivos = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSoloActivos'));

    IF v_soloActivos IS NULL THEN
        SET v_soloActivos = 1;
    END IF;

    SET p_json_result = JSON_ARRAY();

    SELECT JSON_ARRAYAGG(
        JSON_OBJECT(
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
        )
    ) INTO p_json_result
    FROM Movimientos m
    WHERE (v_filtro_tipo IS NULL OR m.Tipo = v_filtro_tipo)
      AND (v_filtro_fecha_desde IS NULL OR m.Fecha >= v_filtro_fecha_desde)
      AND (v_filtro_fecha_hasta IS NULL OR m.Fecha <= v_filtro_fecha_hasta)
      AND m.OrganizacionId = v_organizacionId
      AND (v_sucursalId IS NULL OR m.SucursalId = v_sucursalId)
      AND (v_soloActivos = 0 OR m.Activo = 1)
    ORDER BY m.FechaRegistro DESC;

    SET p_result = 1;
    SET p_mensaje = 'Movimientos obtenidos correctamente';
END$$
DELIMITER ;
