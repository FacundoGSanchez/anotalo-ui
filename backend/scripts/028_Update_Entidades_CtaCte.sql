-- =====================================================
-- Script: 028_Update_Entidades_CtaCte.sql
-- Desc: Agrega columnas de configuracion de Cuenta
--       Corriente a la tabla Entidades y actualiza
--       los SPs de CRUD. Incluye SaldoCtaCte en
--       Movimientos.
-- =====================================================

ALTER TABLE `Entidades`
  ADD COLUMN `CtaCteHabilitado`   tinyint(1)   DEFAULT '0' AFTER `Saldo`,
  ADD COLUMN `CtaCteImporteMaximo` decimal(18,2) DEFAULT NULL AFTER `CtaCteHabilitado`,
  ADD COLUMN `CtaCtePlazoDias`     int          DEFAULT NULL AFTER `CtaCteImporteMaximo`;

-- =====================================================
-- Actualizar SpEntidades_ObtenerTodos
-- =====================================================
DROP PROCEDURE IF EXISTS `SpEntidades_ObtenerTodos`;
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
            'CtaCteHabilitado', e.CtaCteHabilitado,
            'CtaCteImporteMaximo', e.CtaCteImporteMaximo,
            'CtaCtePlazoDias', e.CtaCtePlazoDias,
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

-- =====================================================
-- Actualizar SpEntidades_ObtenerPorId
-- =====================================================
DROP PROCEDURE IF EXISTS `SpEntidades_ObtenerPorId`;
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
        'CtaCteHabilitado', e.CtaCteHabilitado,
        'CtaCteImporteMaximo', e.CtaCteImporteMaximo,
        'CtaCtePlazoDias', e.CtaCtePlazoDias,
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

-- =====================================================
-- Actualizar SpEntidades_Crear
-- =====================================================
DROP PROCEDURE IF EXISTS `SpEntidades_Crear`;
DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpEntidades_Crear`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_tipo VARCHAR(20);
    DECLARE v_nro INT;
    DECLARE v_nombre VARCHAR(200);
    DECLARE v_telefono VARCHAR(50);
    DECLARE v_cuit VARCHAR(20);
    DECLARE v_saldo DECIMAL(18,2);
    DECLARE v_organizacionId INT;
    DECLARE v_sucursalId INT;
    DECLARE v_ctacteHabilitado TINYINT(1);
    DECLARE v_ctacteImporteMaximo DECIMAL(18,2);
    DECLARE v_ctactePlazoDias INT;

    SET v_tipo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTipo'));
    SET v_nombre = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_telefono = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTelefono'));
    SET v_cuit = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCuit'));
    SET v_saldo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSaldo'));
    SET v_organizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_sucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));
    SET v_ctacteHabilitado = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCtaCteHabilitado'));
    SET v_ctacteImporteMaximo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCtaCteImporteMaximo'));
    SET v_ctactePlazoDias = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCtaCtePlazoDias'));

    SELECT COALESCE(MAX(Nro), 0) + 1 INTO v_nro
    FROM Entidades WHERE Tipo = v_tipo AND OrganizacionId = v_organizacionId;

    INSERT INTO Entidades (Tipo, Nro, Nombre, Telefono, Cuit, Saldo,
                           CtaCteHabilitado, CtaCteImporteMaximo, CtaCtePlazoDias,
                           OrganizacionId, SucursalId)
    VALUES (v_tipo, v_nro, v_nombre, v_telefono, v_cuit, COALESCE(v_saldo, 0),
            COALESCE(v_ctacteHabilitado, 0),
            v_ctacteImporteMaximo,
            v_ctactePlazoDias,
            v_organizacionId, v_sucursalId);

    SET p_result = 1;
    SET p_mensaje = 'Entidad creada con éxito';
    SET p_json_result = JSON_OBJECT('id', LAST_INSERT_ID(), 'nro', v_nro);
END$$
DELIMITER ;

-- =====================================================
-- Actualizar SpEntidades_Actualizar
-- =====================================================
DROP PROCEDURE IF EXISTS `SpEntidades_Actualizar`;
DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpEntidades_Actualizar`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_nombre VARCHAR(200);
    DECLARE v_telefono VARCHAR(50);
    DECLARE v_cuit VARCHAR(20);
    DECLARE v_saldo DECIMAL(18,2);
    DECLARE v_organizacionId INT;
    DECLARE v_sucursalId INT;
    DECLARE v_ctacteHabilitado TINYINT(1);
    DECLARE v_ctacteImporteMaximo DECIMAL(18,2);
    DECLARE v_ctactePlazoDias INT;

    SET v_id = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pId'));
    SET v_nombre = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pNombre'));
    SET v_telefono = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTelefono'));
    SET v_cuit = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCuit'));
    SET v_saldo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSaldo'));
    SET v_organizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_sucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));
    SET v_ctacteHabilitado = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCtaCteHabilitado'));
    SET v_ctacteImporteMaximo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCtaCteImporteMaximo'));
    SET v_ctactePlazoDias = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pCtaCtePlazoDias'));

    UPDATE Entidades
    SET Nombre = COALESCE(v_nombre, Nombre),
        Telefono = COALESCE(v_telefono, Telefono),
        Cuit = COALESCE(v_cuit, Cuit),
        Saldo = COALESCE(v_saldo, Saldo),
        CtaCteHabilitado = COALESCE(v_ctacteHabilitado, CtaCteHabilitado),
        CtaCteImporteMaximo = v_ctacteImporteMaximo,
        CtaCtePlazoDias = v_ctactePlazoDias,
        SucursalId = COALESCE(v_sucursalId, SucursalId)
    WHERE Id = v_id
      AND OrganizacionId = v_organizacionId;

    SET p_result = 1;
    SET p_mensaje = 'Entidad actualizada con éxito';
    SET p_json_result = JSON_OBJECT('id', v_id);
END$$
DELIMITER ;

-- =====================================================
-- Agregar SaldoCtaCte a Movimientos
-- =====================================================
ALTER TABLE `Movimientos`
  ADD COLUMN `SaldoCtaCte` decimal(18,2) DEFAULT NULL AFTER `Observacion`;

-- =====================================================
-- Actualizar SpMovimientos_Crear para SaldoCtaCte
-- =====================================================
DROP PROCEDURE IF EXISTS `SpMovimientos_Crear`;
DELIMITER $$
CREATE DEFINER=`anotalo_user`@`%` PROCEDURE `SpMovimientos_Crear`(
    IN p_parametros JSON,
    OUT p_json_result JSON,
    OUT p_result INT,
    OUT p_mensaje VARCHAR(500)
)
BEGIN
    DECLARE v_tipo VARCHAR(50);
    DECLARE v_importe DECIMAL(18,2);
    DECLARE v_formaPago VARCHAR(50);
    DECLARE v_entidadId INT;
    DECLARE v_entidadNombre VARCHAR(200);
    DECLARE v_entidadNro INT;
    DECLARE v_fecha DATE;
    DECLARE v_hora VARCHAR(10);
    DECLARE v_observacion VARCHAR(500);
    DECLARE v_usuario VARCHAR(100);
    DECLARE v_organizacionId INT;
    DECLARE v_sucursalId INT;

    SET v_tipo = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pTipo'));
    SET v_importe = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pImporte'));
    SET v_formaPago = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFormaPago'));
    SET v_entidadId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEntidadId'));
    SET v_entidadNombre = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEntidadNombre'));
    SET v_entidadNro = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pEntidadNro'));
    SET v_fecha = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pFecha'));
    SET v_hora = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pHora'));
    SET v_observacion = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pObservacion'));
    SET v_usuario = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pUsuario'));
    SET v_organizacionId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pOrganizacionId'));
    SET v_sucursalId = JSON_UNQUOTE(JSON_EXTRACT(p_parametros, '$.pSucursalId'));

    INSERT INTO Movimientos (Tipo, Importe, FormaPago, EntidadId, EntidadNombre, EntidadNro,
                             Fecha, Hora, Observacion, Usuario, OrganizacionId, SucursalId)
    VALUES (v_tipo, v_importe, v_formaPago, v_entidadId, v_entidadNombre, v_entidadNro,
            v_fecha, v_hora, v_observacion, v_usuario, v_organizacionId, v_sucursalId);

    SET p_result = 1;
    SET p_mensaje = 'Movimiento creado con éxito';
    SET p_json_result = JSON_OBJECT('id', LAST_INSERT_ID());
END$$
DELIMITER ;
