-- ============================================
-- SCRIPT DML - INSERT ProcessHandler
-- Sistema: Anotalo
-- Registro de todos los SPs en la tabla ProcessHandler
-- ============================================

INSERT INTO ProcessHandler (n_proceso, procedure_name) VALUES
-- Auth
('LOGIN',                    'SpLogin'),

-- Query (GET) - Organizacion
('ORGANIZACION_OBTENER',     'SpOrganizacionObtener'),

-- Query (GET) - Sucursal
('SUCURSAL_OBTENER',         'SpSucursalObtener'),

-- Query (GET) - Usuario
('USUARIO_OBTENER',          'SpUsuarioObtener'),

-- Query (GET) - Rol
('ROL_OBTENER',              'SpRolObtener'),

-- Query (GET) - Cliente
('CLIENTE_OBTENER',          'SpClienteObtener'),

-- Query (GET) - Proveedor
('PROVEEDOR_OBTENER',        'SpProveedorObtener'),

-- Query (GET) - Movimiento
('MOVIMIENTO_OBTENER',       'SpMovimientoObtener'),

-- Query (GET) - Cierre
('CIERRE_OBTENER',           'SpCierreObtener'),

-- Query (GET) - Configuracion
('FORMAPAGO_OBTENER',        'SpFormaPagoObtener'),
('RUBRO_OBTENER',            'SpRubroObtener'),
('CONFIGPOS_OBTENER',        'SpConfigPOSObtener'),

-- Query (GET) - Dashboard
('DASHBOARD_OBTENER',        'SpDashboardObtener'),

-- Command (POST) - Cliente
('CLIENTE_REGISTRAR',        'SpClienteRegistrar'),

-- Command (POST) - Proveedor
('PROVEEDOR_REGISTRAR',      'SpProveedorRegistrar'),

-- Command (POST) - Movimiento
('MOVIMIENTO_REGISTRAR',     'SpMovimientoRegistrar'),

-- Command (POST) - Cierre
('CIERRE_REGISTRAR',         'SpCierreRegistrar'),

-- Command (POST) - Organizacion
('ORGANIZACION_REGISTRAR',   'SpOrganizacionRegistrar'),

-- Command (POST) - Sucursal
('SUCURSAL_REGISTRAR',       'SpSucursalRegistrar'),

-- Command (POST) - Usuario
('USUARIO_REGISTRAR',        'SpUsuarioRegistrar'),

-- Command (POST) - Configuracion
('FORMAPAGO_REGISTRAR',      'SpFormaPagoRegistrar'),
('RUBRO_REGISTRAR',          'SpRubroRegistrar'),
('CONFIGPOS_REGISTRAR',      'SpConfigPOSRegistrar');
