# Scripts de Base de Datos — Anotalo

## Estructura de directorios

```
backend/scripts/
├── Tablas/        → Definiciones CREATE TABLE
├── query/         → Stored Procedures de lectura (SELECT)
├── command/       → Stored Procedures de escritura (INSERT/UPDATE)
└── handler/       → Registro de procesos
```

---

## Tablas — `backend/scripts/Tablas/`

| Archivo                          | Objetivo                                                      |
| -------------------------------- | ------------------------------------------------------------- |
| `Create_AdminCajaCierre.sql`     | Cierre de caja administrativo                                 |
| `Create_Clientes.sql`            | Maestro de clientes                                           |
| `Create_ConfigFormaPago.sql`     | Configuración de formas de pago por organización              |
| `Create_ConfigPOS.sql`           | Configuración del POS por organización                        |
| `Create_ConfigRubro.sql`         | Rubros (items) configurables por organización                 |
| `Create_Movimiento.sql`          | Cabecera de movimientos (Venta, Pago, Cobro, Ingreso, Retiro) |
| `Create_MovimientoDetalle.sql`   | Detalle de movimientos (items)                                |
| `Create_MovimientoFormaPago.sql` | Medios de pago aplicados a cada movimiento                    |
| `Create_Organizaciones.sql`      | Organizaciones                                                |
| `Create_Proveedores.sql`         | Maestro de proveedores                                        |
| `Create_Rol.sql`                 | Roles de usuario                                              |
| `Create_RolPermisos.sql`         | Permisos por rol (módulo, formulario, acciones JSON)          |
| `Create_Sucursales.sql`          | Sucursales por organización                                   |
| `Create_UsuarioOrganizacion.sql` | Relación usuario–organización + organizacion default          |
| `Create_UsuarioRol.sql`          | Relación usuario–rol                                          |
| `Create_Usuarios.sql`            | Usuarios del sistema                                          |
| `Create_UsuarioSucursal.sql`     | Relación usuario–sucursal + sucursal default                  |

---

## Query (lectura) — `backend/scripts/query/`

Todos los SP reciben `IN p_parametros JSON` y devuelven `OUT p_json_result JSON`.

### 01_Query_Login.sql

**SpLogin** — Autentica usuario y devuelve sesión, organizaciones, roles y sucursales.

```json
// p_parametros
{
  "username": "admin",
  "password": "adminanotalo"
}

// p_json_result (success)
{
  "token": "tok_<uuid>",
  "sessionId": "sess_<timestamp>_<hash>",
  "usuario": {
    "id": 1,
    "username": "admin",
    "mail": "admin@mail.com",
    "nombre": "Admin",
    "rol": "Admin",
    "roles": [1, 2]
  },
  "organizaciones": [
    {
      "id": 1,
      "nombre": "Mi Org",
      "sucursalDefault": 1,
      "FormasPago": {
        "Venta": [
          { "id": 1, "nombre": "Efectivo", "sigla": "EF", "requiereEntidad": 0, "impactaCaja": 1, "impactaCtaCte": 0 }
        ],
        "Pago": [],
        "Cobro": []
      }
    }
  ],
  "rolesData": [
    {
      "id": 1,
      "nombre": "Admin",
      "permisos": [
        { "modulo": "Ventas", "formulario": "POS", "acciones": "[\"leer\",\"crear\"]" }
      ]
    }
  ],
  "sucursales": [
    { "id": 1, "organizacionId": 1, "nombre": "Sucursal 1" }
  ]
}

// p_json_result (error)
{ "success": false, "error": "Credenciales inválidas" }
```

### 02_Query_Organizacion.sql

**SpOrganizacionObtener** — Obtiene organizaciones activas.

```json
// p_parametros
{ "pId": 1 }

// p_json_result
[
  { "id": 1, "nombre": "Mi Org", "activo": 1 }
]
```

### 03_Query_Sucursal.sql

**SpSucursalObtener** — Obtiene sucursales por organización.

```json
// p_parametros
{ "pId": 1, "pOrganizacionId": 1 }

// p_json_result
[
  {
    "id": 1,
    "organizacionId": 1,
    "nombre": "Sucursal 1",
    "activo": 1,
    "fechaRegistro": "2025-01-01 10:00:00"
  }
]
```

### 04_Query_Usuario.sql

**SpUsuarioObtener** — Obtiene usuarios con sus roles y sucursales asignadas.

```json
// p_parametros
{ "pId": 1, "pActivo": 1 }

// p_json_result
[
  {
    "id": 1,
    "username": "admin",
    "mail": "admin@mail.com",
    "nombre": "Admin",
    "activo": 1,
    "roles": [1, 2],
    "sucursales": [
      { "id": 1, "organizacionId": 1, "nombre": "Sucursal 1" }
    ],
    "fechaRegistro": "2025-01-01 10:00:00"
  }
]
```

**SpRolObtener** — Obtiene roles con sus permisos.

```json
// p_parametros
{ "pId": 1 }

// p_json_result
[
  {
    "id": 1,
    "nombre": "Admin",
    "activo": 1,
    "permisos": [
      { "modulo": "Ventas", "formulario": "POS", "acciones": "[\"leer\",\"crear\"]" }
    ],
    "fechaRegistro": "2025-01-01 10:00:00"
  }
]
```

### 05_Query_Cliente.sql

**SpClienteObtener** — Obtiene clientes.

```json
// p_parametros
{ "pId": 1, "pActivo": 1 }

// p_json_result
[
  {
    "id": 1,
    "nombre": "Juan Perez",
    "telefono": "123456",
    "mail": "juan@mail.com",
    "activo": 1,
    "ctaCteSaldo": 0.00,
    "ctaCteConfig": {
      "habilitado": 1,
      "importeMaximo": 5000.00,
      "plazoDias": 30
    },
    "fechaRegistro": "2025-01-01 10:00:00"
  }
]
```

### 06_Query_Proveedor.sql

**SpProveedorObtener** — Obtiene proveedores.

```json
// p_parametros
{ "pId": 1, "pActivo": 1 }

// p_json_result
[
  {
    "id": 1,
    "nombre": "Proveedor SA",
    "telefono": "654321",
    "mail": "info@proveedor.com",
    "activo": 1,
    "fechaRegistro": "2025-01-01 10:00:00"
  }
]
```

### 07_Query_Movimiento.sql

**SpMovimientoObtener** — Obtiene movimientos con detalle y formas de pago.

```json
// p_parametros
{
  "pId": 1,
  "pSucursalId": 1,
  "pTipo": "Venta",
  "pFechaDesde": "2025-01-01",
  "pFechaHasta": "2025-12-31"
}

// p_json_result
[
  {
    "id": 1,
    "tipo": "Venta",
    "importe": 1000.00,
    "lineItems": [
      {
        "id": 1,
        "importe": 500.00,
        "itemId": 1,
        "itemDetalle": "Producto X"
      }
    ],
    "formaPagos": [
      { "nombre": "Efectivo", "importe": 1000.00 }
    ],
    "entidad": { "id": 1, "nombre": "Juan Perez" },
    "fechaRegistro": "2025-01-15 14:30:00",
    "usuarioId": 1,
    "sucursalId": 1,
    "organizacionId": 1,
    "observacion": "..."
  }
]
```

### 08_Query_Cierre.sql

**SpCierreObtener** — Obtiene cierres de caja.

```json
// p_parametros
{ "pId": 1, "pSucursalId": 1, "pFecha": "2025-01-15" }

// p_json_result
[
  {
    "id": 1,
    "fechaRegistro": "2025-01-15 20:00:00",
    "saldo": 5000.00,
    "usuarioId": 1,
    "sucursalId": 1,
    "organizacionId": 1
  }
]
```

### 09_Query_ConfigOrg.sql

**SpFormaPagoObtener** — Obtiene formas de pago.

```json
// p_parametros
{ "pId": 1, "pOrganizacionId": 1, "pTipo": "Venta" }

// p_json_result
[
  {
    "id": 1,
    "organizacionId": 1,
    "tipo": "Venta",
    "nombre": "Efectivo",
    "sigla": "EF",
    "requiereEntidad": 0,
    "impactaCaja": 1,
    "impactaCtaCte": 0,
    "activo": 1
  }
]
```

**SpRubroObtener** — Obtiene rubros.

```json
// p_parametros
{ "pId": 1, "pOrganizacionId": 1 }

// p_json_result
[
  {
    "id": 1,
    "organizacionId": 1,
    "sigla": "GRAL",
    "nombre": "General",
    "activo": 1
  }
]
```

**SpConfigPOSObtener** — Obtiene configuración POS.

```json
// p_parametros
{ "pId": 1, "pOrganizacionId": 1 }

// p_json_result
[
  {
    "id": 1,
    "organizacionId": 1,
    "usaRubro": 1
  }
]
```

### 10_Query_Dashboard.sql

**SpDashboardObtener** — Obtiene resumen del dashboard del día.

```json
// p_parametros
{ "pSucursalId": 1, "pFecha": "2025-01-15" }

// p_json_result
{
  "resumen": {
    "totalVentas": 10000.00,
    "totalPagos": 2000.00,
    "totalCobros": 1500.00,
    "totalIngresos": 500.00,
    "totalRetiros": 300.00,
    "cantMovimientos": 42,
    "cantClientes": 15,
    "cantProveedores": 8
  }
}
```

---

## Command (escritura) — `backend/scripts/command/`

Todos los SP reciben `IN p_parametros JSON` y devuelven `OUT p_json_result JSON` con `{"id": <nuevo_id>}`.

### 11_Comand_Cliente.sql

**SpClienteRegistrar** — Crea o actualiza un cliente.

```json
// p_parametros
{
  "pId": null,
  "pNombre": "Juan Perez",
  "pTelefono": "123456",
  "pMail": "juan@mail.com",
  "pActivo": 1,
  "pCtaCteHabilitado": 0,
  "pCtaCteImporteMaximo": null,
  "pCtaCtePlazoDias": null
}

// p_json_result
{ "id": 1234567890123 }
```

### 12_Comand_Proveedor.sql

**SpProveedorRegistrar** — Crea o actualiza un proveedor.

```json
// p_parametros
{
  "pId": null,
  "pNombre": "Proveedor SA",
  "pTelefono": "654321",
  "pMail": "info@proveedor.com",
  "pActivo": 1
}

// p_json_result
{ "id": 1234567890123 }
```

### 13_Comand_Movimiento.sql

**SpMovimientoRegistrar** — Crea o actualiza un movimiento con detalle y formas de pago.

```json
// p_parametros
{
  "pId": null,
  "pTipo": "Venta",
  "pImporteTotal": 1000.00,
  "pEntidadId": 1,
  "pEntidadNombre": "Juan Perez",
  "pUsuarioId": 1,
  "pSucursalId": 1,
  "pOrganizacionId": 1,
  "pObservacion": "...",
  "pLineItems": [
    { "importe": 500.00, "itemId": 1, "itemDetalle": "Producto X" },
    { "importe": 500.00, "itemId": 2, "itemDetalle": "Producto Y" }
  ],
  "pFormaPagos": [
    { "formaPagoId": 1, "importe": 1000.00 }
  ]
}

// p_json_result
{ "id": 1234567890123 }
```

### 14_Comand_Cierre.sql

**SpCierreRegistrar** — Crea o actualiza un cierre de caja.

```json
// p_parametros
{
  "pId": null,
  "pSaldo": 5000.00,
  "pUsuarioId": 1,
  "pSucursalId": 1,
  "pOrganizacionId": 1
}

// p_json_result
{ "id": 1234567890123 }
```

### 15_Comand_Organizacion.sql

**SpOrganizacionRegistrar** — Crea o actualiza una organización.

```json
// p_parametros
{
  "pId": null,
  "pNombre": "Mi Org",
  "pActivo": 1
}

// p_json_result
{ "id": 1 }
```

### 16_Comand_Sucursal.sql

**SpSucursalRegistrar** — Crea o actualiza una sucursal.

```json
// p_parametros
{
  "pId": null,
  "pOrganizacionId": 1,
  "pNombre": "Sucursal 1",
  "pActivo": 1
}

// p_json_result
{ "id": 1 }
```

### 17_Comand_Usuario.sql

**SpUsuarioRegistrar** — Crea o actualiza un usuario con roles y sucursales.

```json
// p_parametros
{
  "pId": null,
  "pUsername": "admin",
  "pPassword": "adminanotalo",
  "pMail": "admin@mail.com",
  "pNombre": "Admin",
  "pActivo": 1,
  "pRoles": [1, 2],
  "pSucursales": [1]
}

// p_json_result
{ "id": 1 }
```

### 18_Comand_ConfigOrg.sql

**SpFormaPagoRegistrar** — Crea o actualiza una forma de pago.

```json
// p_parametros
{
  "pId": null,
  "pOrganizacionId": 1,
  "pTipo": "Venta",
  "pNombre": "Efectivo",
  "pSigla": "EF",
  "pRequiereEntidad": 0,
  "pImpactaCaja": 1,
  "pImpactaCtaCte": 0,
  "pActivo": 1
}

// p_json_result
{ "id": 1 }
```

**SpRubroRegistrar** — Crea o actualiza un rubro.

```json
// p_parametros
{
  "pId": null,
  "pOrganizacionId": 1,
  "pSigla": "GRAL",
  "pNombre": "General",
  "pActivo": 1
}

// p_json_result
{ "id": 1 }
```

**SpConfigPOSRegistrar** — Crea o actualiza la configuración POS.

```json
// p_parametros
{
  "pId": null,
  "pOrganizacionId": 1,
  "pUsaRubro": 1
}

// p_json_result
{ "id": 1 }
```

---

## Handler — `backend/scripts/handler/`

| Archivo                     | Objetivo                                                                 |
| --------------------------- | ------------------------------------------------------------------------ |
| `99_DML_ProcessHandler.sql` | Registro de todos los SPs en la tabla `ProcessHandler` para enrutamiento |

### Procesos registrados

| n_proceso                | procedure_name            |
| ------------------------ | ------------------------- |
| `LOGIN`                  | `SpLogin`                 |
| `ORGANIZACION_OBTENER`   | `SpOrganizacionObtener`   |
| `SUCURSAL_OBTENER`       | `SpSucursalObtener`       |
| `USUARIO_OBTENER`        | `SpUsuarioObtener`        |
| `ROL_OBTENER`            | `SpRolObtener`            |
| `CLIENTE_OBTENER`        | `SpClienteObtener`        |
| `PROVEEDOR_OBTENER`      | `SpProveedorObtener`      |
| `MOVIMIENTO_OBTENER`     | `SpMovimientoObtener`     |
| `CIERRE_OBTENER`         | `SpCierreObtener`         |
| `FORMAPAGO_OBTENER`      | `SpFormaPagoObtener`      |
| `RUBRO_OBTENER`          | `SpRubroObtener`          |
| `CONFIGPOS_OBTENER`      | `SpConfigPOSObtener`      |
| `DASHBOARD_OBTENER`      | `SpDashboardObtener`      |
| `CLIENTE_REGISTRAR`      | `SpClienteRegistrar`      |
| `PROVEEDOR_REGISTRAR`    | `SpProveedorRegistrar`    |
| `MOVIMIENTO_REGISTRAR`   | `SpMovimientoRegistrar`   |
| `CIERRE_REGISTRAR`       | `SpCierreRegistrar`       |
| `ORGANIZACION_REGISTRAR` | `SpOrganizacionRegistrar` |
| `SUCURSAL_REGISTRAR`     | `SpSucursalRegistrar`     |
| `USUARIO_REGISTRAR`      | `SpUsuarioRegistrar`      |
| `FORMAPAGO_REGISTRAR`    | `SpFormaPagoRegistrar`    |
| `RUBRO_REGISTRAR`        | `SpRubroRegistrar`        |
| `CONFIGPOS_REGISTRAR`    | `SpConfigPOSRegistrar`    |
