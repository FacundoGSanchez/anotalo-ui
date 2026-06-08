# SDD - Configuración de Organización

## Especificación de Configuración por Organización

**Versión:** 0.2
**Fecha:** 07/06/2026
**Propósito:** Definir la estructura de configuración que cada organización debe tener, incluyendo formas de pago personalizadas con propiedades por tipo de movimiento, condiciones comerciales y datos de autenticación.

---

## 1. Relación de Configuración

La configuración depende de tres ejes principales:

```
Organización ── tiene ──> Configuración
                  │
                  ├── TipoMovimiento (Venta, Pago)
                  │       └── FormaPago[]
                  │             ├── key
                  │             ├── label
                  │             ├── enabled
                  │             ├── requiereEntidad
                  │             ├── impactaCaja
                  │             └── impactaCtaCte
                  │
                  ├── CondicionesCtaCte
                  └── Sucursales
```

### 1.1 Cardinalidad

| Relación | Tipo |
|----------|------|
| Organización → Configuración | 1:1 |
| Configuración → TipoMovimiento | 1:N (Venta, Pago) |
| TipoMovimiento → FormaPago | 1:N |
| FormaPago → Propiedades | 1:1 (requiereEntidad, impactaCaja, impactaCtaCte) |

---

## 2. Estructura de Configuración

Cada organización puede tener su propia configuración almacenada en `localStorage` bajo la clave `org_config_{orgId}`.

### 2.1 Esquema General

```json
{
  "formasPago": {
    "Venta": [
      {
        "key": "Efectivo",
        "label": "Efectivo",
        "enabled": true,
        "requiereEntidad": false,
        "impactaCaja": true,
        "impactaCtaCte": false
      },
      {
        "key": "Cta Corriente",
        "label": "Cta. Cte.",
        "enabled": true,
        "requiereEntidad": true,
        "impactaCaja": false,
        "impactaCtaCte": true
      }
    ],
    "Pago": [
      {
        "key": "Efectivo",
        "label": "Efectivo",
        "enabled": true,
        "requiereEntidad": false,
        "impactaCaja": true,
        "impactaCtaCte": false
      },
      {
        "key": "Transferencia",
        "label": "Transferencia",
        "enabled": true,
        "requiereEntidad": false,
        "impactaCaja": false,
        "impactaCtaCte": false
      }
    ]
  },
  "condicionesCtaCte": {
    "alertaDiasVencimiento": 30,
    "plazoMaximo": 60,
    "cantidadMaxima": 100000,
    "periodicidadPago": "mensual"
  }
}
```

### 2.2 Formas de Pago por Tipo de Movimiento

Cada organización define listas separadas de formas de pago para:

| Tipo | Propósito |
|------|-----------|
| `formasPago.Venta` | Formas de pago disponibles para movimientos de Venta (ingresos) |
| `formasPago.Pago` | Formas de pago disponibles para movimientos de Pago (egresos) |

Si un tipo no tiene configuraciones específicas, se usan las formas de pago default del sistema (`posConstants.FORMAS_PAGO`).

### 2.3 Propiedades de Forma de Pago

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `key` | string | — | Identificador único de la forma de pago |
| `label` | string | `key` | Nombre visible personalizable |
| `enabled` | boolean | true | Si está habilitada para su uso |
| `requiereEntidad` | boolean | false | Si requiere seleccionar cliente/proveedor al usarla |
| `impactaCaja` | boolean | false | Si el movimiento afecta el saldo de caja física |
| `impactaCtaCte` | boolean | false | Si el movimiento afecta la cuenta corriente de la entidad |

---

## 3. JSON de Respuesta de Autenticación (para equipo BE)

### 3.1 Estructura del endpoint `/api/auth/login`

```json
{
  "usuario": {
    "id": 1,
    "username": "admin",
    "mail": "admin@anotalo.com",
    "nombre": "Admin",
    "rol": "ADMIN_ROOT"
  },
  "token": "jwt-token-aqui",
  "organizaciones": [
    {
      "id": 1,
      "nombre": "Org Principal",
      "sucursalDefault": 1,
      "config": {
        "formasPago": {
          "Venta": [
            { "key": "Efectivo", "label": "Efectivo", "enabled": true, "requiereEntidad": false, "impactaCaja": true, "impactaCtaCte": false },
            { "key": "Tarjetas", "label": "Tarjetas", "enabled": true, "requiereEntidad": false, "impactaCaja": false, "impactaCtaCte": false },
            { "key": "Cuenta Cte", "label": "Cuenta Cte", "enabled": true, "requiereEntidad": true, "impactaCaja": false, "impactaCtaCte": true }
          ],
          "Pago": [
            { "key": "Efectivo", "label": "Efectivo", "enabled": true, "requiereEntidad": false, "impactaCaja": true, "impactaCtaCte": false },
            { "key": "Transferencia", "label": "Transferencia", "enabled": true, "requiereEntidad": false, "impactaCaja": false, "impactaCtaCte": false }
          ]
        },
        "condicionesCtaCte": {
          "alertaDiasVencimiento": 30,
          "plazoMaximo": 60,
          "cantidadMaxima": 100000,
          "periodicidadPago": "mensual"
        }
      }
    },
    {
      "id": 2,
      "nombre": "Org Secundaria",
      "sucursalDefault": null,
      "config": {
        "formasPago": {
          "Venta": [
            { "key": "Efectivo", "label": "Efectivo", "enabled": true, "requiereEntidad": false, "impactaCaja": true, "impactaCtaCte": false },
            { "key": "Mercado Pago", "label": "Mercado Pago", "enabled": true, "requiereEntidad": false, "impactaCaja": false, "impactaCtaCte": false }
          ],
          "Pago": [
            { "key": "Transferencia", "label": "Transferencia", "enabled": true, "requiereEntidad": false, "impactaCaja": false, "impactaCtaCte": false }
          ]
        }
      }
    }
  ],
  "sucursales": [
    { "id": 1, "organizacionId": 1, "nombre": "Sucursal Centro" },
    { "id": 2, "organizacionId": 1, "nombre": "Sucursal Norte" }
  ],
  "roles": ["ADMIN_ROOT", "ADMIN"]
}
```

### 3.2 Consideraciones para el Backend

1. **La configuración se incluye en la respuesta de autenticación** para que esté disponible sin llamadas adicionales al iniciar la app.
2. Cada organización puede tener configuraciones diferentes, incluso para el mismo tipo de movimiento.
3. Las propiedades `requiereEntidad`, `impactaCaja`, `impactaCtaCte` son opcionales; si no se envían, el frontend usa los valores default de `posConstants.jsx`.
4. El campo `enabled` permite deshabilitar formas de pago sin eliminarlas de la configuración.
5. `condicionesCtaCte` es opcional y se usa para configurar alertas de cuenta corriente a nivel organización.

---

## 4. Mock de Organización

### 4.1 Org Principal (id: 1)

```json
{
  "id": 1,
  "nombre": "Org Principal",
  "sucursalDefault": 1,
  "config": {
    "formasPago": {
      "Venta": [
        { "key": "Efectivo", "label": "Efectivo", "enabled": true, "requiereEntidad": false, "impactaCaja": true, "impactaCtaCte": false },
        { "key": "Tarjetas", "label": "Tarjetas", "enabled": true, "requiereEntidad": false, "impactaCaja": false, "impactaCtaCte": false },
        { "key": "Cuenta Cte", "label": "Cuenta Cte", "enabled": true, "requiereEntidad": true, "impactaCaja": false, "impactaCtaCte": true }
      ],
      "Pago": [
        { "key": "Efectivo", "label": "Efectivo", "enabled": true, "requiereEntidad": false, "impactaCaja": true, "impactaCtaCte": false },
        { "key": "Transferencia", "label": "Transferencia", "enabled": true, "requiereEntidad": false, "impactaCaja": false, "impactaCtaCte": false }
      ]
    }
  }
}
```

### 4.2 Org Secundaria (id: 2)

```json
{
  "id": 2,
  "nombre": "Org Secundaria",
  "sucursalDefault": null,
  "config": {
    "formasPago": {
      "Venta": [
        { "key": "Efectivo", "label": "Efectivo", "enabled": true, "requiereEntidad": false, "impactaCaja": true, "impactaCtaCte": false },
        { "key": "Mercado Pago", "label": "Mercado Pago", "enabled": true, "requiereEntidad": false, "impactaCaja": false, "impactaCtaCte": false }
      ],
      "Pago": [
        { "key": "Transferencia", "label": "Transferencia", "enabled": true, "requiereEntidad": false, "impactaCaja": false, "impactaCtaCte": false }
      ]
    }
  }
}
```

---

## 5. Servicio de Configuración

### `orgService.js`

| Método | Descripción |
|--------|-------------|
| `getConfig(orgId)` | Obtiene toda la configuración de la org |
| `saveConfig(orgId, data)` | Guarda configuración |
| `getFormasPago(orgId, tipo)` | Obtiene formas de pago para un tipo (Venta/Pago) |
| `saveFormasPago(orgId, tipo, formas)` | Guarda formas de pago para un tipo |
| `initOrgConfig(orgId, config)` | Inicializa configuración desde la sesión |

---

---

## 7. Scripts SQL para Backend

### 7.1 Tablas

```sql
-- Tabla de formas de pago por organización
CREATE TABLE OrganizacionFormaPago (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrganizacionId INT NOT NULL FOREIGN KEY REFERENCES Organizacion(Id),
    TipoMovimiento VARCHAR(10) NOT NULL, -- 'Venta' o 'Pago'
    [Key] VARCHAR(50) NOT NULL,
    Label VARCHAR(100) NOT NULL,
    Enabled BIT NOT NULL DEFAULT 1,
    RequiereEntidad BIT NOT NULL DEFAULT 0,
    ImpactaCaja BIT NOT NULL DEFAULT 0,
    ImpactaCtaCte BIT NOT NULL DEFAULT 0,
    FechaAlta DATETIME2 NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME2 NULL,
    CONSTRAINT UQ_OrgTipoKey UNIQUE (OrganizacionId, TipoMovimiento, [Key])
);

-- Tabla de condiciones de cuenta corriente por organización
CREATE TABLE OrganizacionCondicionesCtaCte (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrganizacionId INT NOT NULL FOREIGN KEY REFERENCES Organizacion(Id),
    AlertaDiasVencimiento INT NULL,
    PlazoMaximo INT NULL,
    CantidadMaxima DECIMAL(18,2) NULL,
    PeriodicidadPago VARCHAR(20) NULL, -- 'semanal', 'quincenal', 'mensual'
    FechaAlta DATETIME2 NOT NULL DEFAULT GETDATE(),
    FechaModificacion DATETIME2 NULL,
    CONSTRAINT UQ_OrgCtaCte UNIQUE (OrganizacionId)
);
```

### 7.2 Stored Procedures CRUD

```sql
-- =============================================
-- SP: Obtener formas de pago por organización y tipo
-- =============================================
CREATE PROCEDURE sp_OrganizacionFormaPago_Get
    @OrganizacionId INT,
    @TipoMovimiento VARCHAR(10) = NULL
AS
BEGIN
    SELECT
        [Key],
        Label,
        Enabled,
        RequiereEntidad,
        ImpactaCaja,
        ImpactaCtaCte
    FROM OrganizacionFormaPago
    WHERE OrganizacionId = @OrganizacionId
      AND (@TipoMovimiento IS NULL OR TipoMovimiento = @TipoMovimiento)
    ORDER BY TipoMovimiento, [Key];
END;
```

```sql
-- =============================================
-- SP: Guardar formas de pago (reemplaza todas las de un tipo)
-- =============================================
CREATE PROCEDURE sp_OrganizacionFormaPago_Save
    @OrganizacionId INT,
    @TipoMovimiento VARCHAR(10),
    @FormasJson NVARCHAR(MAX) -- JSON array de objetos
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Now DATETIME2 = GETDATE();

    BEGIN TRANSACTION;

    -- Eliminar existentes del tipo
    DELETE FROM OrganizacionFormaPago
    WHERE OrganizacionId = @OrganizacionId
      AND TipoMovimiento = @TipoMovimiento;

    -- Insertar nuevas
    INSERT INTO OrganizacionFormaPago (
        OrganizacionId, TipoMovimiento, [Key], Label, Enabled,
        RequiereEntidad, ImpactaCaja, ImpactaCtaCte, FechaAlta
    )
    SELECT
        @OrganizacionId,
        @TipoMovimiento,
        JSON_VALUE(f.value, '$.key'),
        JSON_VALUE(f.value, '$.label'),
        ISNULL(JSON_VALUE(f.value, '$.enabled'), 'true'),
        ISNULL(JSON_VALUE(f.value, '$.requiereEntidad'), 'false'),
        ISNULL(JSON_VALUE(f.value, '$.impactaCaja'), 'false'),
        ISNULL(JSON_VALUE(f.value, '$.impactaCtaCte'), 'false'),
        @Now
    FROM OPENJSON(@FormasJson) AS f;

    COMMIT TRANSACTION;
END;
```

```sql
-- =============================================
-- SP: Eliminar una forma de pago específica
-- =============================================
CREATE PROCEDURE sp_OrganizacionFormaPago_Delete
    @OrganizacionId INT,
    @TipoMovimiento VARCHAR(10),
    @Key VARCHAR(50)
AS
BEGIN
    DELETE FROM OrganizacionFormaPago
    WHERE OrganizacionId = @OrganizacionId
      AND TipoMovimiento = @TipoMovimiento
      AND [Key] = @Key;
END;
```

```sql
-- =============================================
-- SP: Obtener condiciones de Cta Cte
-- =============================================
CREATE PROCEDURE sp_OrganizacionCondicionesCtaCte_Get
    @OrganizacionId INT
AS
BEGIN
    SELECT
        AlertaDiasVencimiento,
        PlazoMaximo,
        CantidadMaxima,
        PeriodicidadPago
    FROM OrganizacionCondicionesCtaCte
    WHERE OrganizacionId = @OrganizacionId;
END;
```

### 7.3 SP de Autenticación

```sql
-- =============================================
-- SP: Login con configuración completa
-- =============================================
CREATE PROCEDURE sp_Auth_Login
    @Username VARCHAR(50),
    @Password VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @UsuarioId INT;
    DECLARE @UsuarioNombre VARCHAR(100);
    DECLARE @UsuarioRol VARCHAR(20);

    -- Validar credenciales
    SELECT
        @UsuarioId = u.Id,
        @UsuarioNombre = u.Nombre,
        @UsuarioRol = u.Rol
    FROM Usuario u
    WHERE u.Username = @Username
      AND u.[Password] = @Password
      AND u.Activo = 1;

    IF @UsuarioId IS NULL
    BEGIN
        RAISERROR('Credenciales incorrectas.', 16, 1);
        RETURN;
    END;

    -- Obtener organizaciones del usuario con su configuración
    SELECT
        o.Id AS OrganizacionId,
        o.Nombre AS OrganizacionNombre,
        o.SucursalDefault,
        -- Config como JSON
        (
            SELECT
                -- Formas de pago agrupadas por tipo
                (
                    SELECT
                        ofp.[Key],
                        ofp.Label,
                        ofp.Enabled,
                        ofp.RequiereEntidad,
                        ofp.ImpactaCaja,
                        ofp.ImpactaCtaCte
                    FROM OrganizacionFormaPago ofp
                    WHERE ofp.OrganizacionId = o.Id
                      AND ofp.TipoMovimiento = 'Venta'
                    FOR JSON PATH
                ) AS Venta,
                (
                    SELECT
                        ofp.[Key],
                        ofp.Label,
                        ofp.Enabled,
                        ofp.RequiereEntidad,
                        ofp.ImpactaCaja,
                        ofp.ImpactaCtaCte
                    FROM OrganizacionFormaPago ofp
                    WHERE ofp.OrganizacionId = o.Id
                      AND ofp.TipoMovimiento = 'Pago'
                    FOR JSON PATH
                ) AS Pago
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ) AS FormasPago,
        (
            SELECT
                occ.AlertaDiasVencimiento,
                occ.PlazoMaximo,
                occ.CantidadMaxima,
                occ.PeriodicidadPago
            FROM OrganizacionCondicionesCtaCte occ
            WHERE occ.OrganizacionId = o.Id
            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ) AS CondicionesCtaCte
    FROM UsuarioOrganizacion uo
    INNER JOIN Organizacion o ON o.Id = uo.OrganizacionId
    WHERE uo.UsuarioId = @UsuarioId
    FOR JSON PATH;

    -- Devolver también datos del usuario, token, sucursales y roles
    -- (la respuesta completa se arma en handler)
END;
```

### 7.4 Handler de Login (C# - .NET)

```csharp
[HttpPost("api/auth/login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    // 1. Ejecutar sp_Auth_Login
    // 2. Armar respuesta con:
    //    - usuario
    //    - token JWT
    //    - organizaciones (con formasPago y condicionesCtaCte embebidas)
    //    - sucursales
    //    - roles

    var response = new
    {
        usuario = new
        {
            id = usuario.Id,
            username = usuario.Username,
            mail = usuario.Mail,
            nombre = usuario.Nombre,
            rol = usuario.Rol
        },
        token = jwtToken,
        organizaciones = organizaciones,  // incluye config
        sucursales = sucursales,
        roles = roles
    };

    return Ok(response);
}
```

### 7.5 Script de Inserción Inicial (Seed)

```sql
-- =============================================
-- Seed: Insertar formas de pago default para una nueva organización
-- =============================================
CREATE PROCEDURE sp_OrganizacionFormaPago_SeedDefaults
    @OrganizacionId INT
AS
BEGIN
    -- Venta: Efectivo, Cta Corriente, Tarjeta
    INSERT INTO OrganizacionFormaPago (OrganizacionId, TipoMovimiento, [Key], Label, Enabled, RequiereEntidad, ImpactaCaja, ImpactaCtaCte)
    VALUES
        (@OrganizacionId, 'Venta', 'Efectivo',      'Efectivo',      1, 0, 1, 0),
        (@OrganizacionId, 'Venta', 'Cta Corriente', 'Cta. Corriente', 1, 1, 0, 1),
        (@OrganizacionId, 'Venta', 'Tarjeta',       'Tarjeta',       1, 0, 0, 0);

    -- Pago: Efectivo, Cta Corriente, Tarjeta
    INSERT INTO OrganizacionFormaPago (OrganizacionId, TipoMovimiento, [Key], Label, Enabled, RequiereEntidad, ImpactaCaja, ImpactaCtaCte)
    VALUES
        (@OrganizacionId, 'Pago', 'Efectivo',      'Efectivo',      1, 0, 1, 0),
        (@OrganizacionId, 'Pago', 'Cta Corriente', 'Cta. Corriente', 1, 1, 0, 1),
        (@OrganizacionId, 'Pago', 'Tarjeta',       'Tarjeta',       1, 0, 0, 0);
END;
```

### 7.6 Consideraciones para el Backend

1. **Seed automático**: Al crear una nueva organización, ejecutar `sp_OrganizacionFormaPago_SeedDefaults` para poblar las formas de pago base.
2. **Reemplazo completo**: `sp_OrganizacionFormaPago_Save` elimina todas las formas de pago del tipo y las reinserta (operación atómica en transacción).
3. **Autenticación**: El SP de login devuelve la configuración completa embebida en cada organización como JSON, evitando llamadas adicionales.
4. **Booleano en SQL**: Los campos `Enabled`, `RequiereEntidad`, `ImpactaCaja`, `ImpactaCtaCte` se almacenan como `BIT` en SQL Server.
5. **JSON_VALUE**: Los booleanos vienen como string 'true'/'false' desde JSON; SQL Server los convierte automáticamente a BIT.

---

## 6. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/services/orgService.js` | Servicio de configuración por organización |
| `src/services/authService.js` | Mock con config de org en respuesta de login |
| `src/constants/posConstants.js` | Formas de pago default del sistema + propiedades |
| `src/pages/POSAnotalo/components/steps/StepFormaPago.jsx` | Consume formas de pago por org y tipo |
| `src/pages/FormasPagoConfig/FormasPagoConfigPage.jsx` | Configuración visual de formas de pago con selector de org |
| `src/context/AuthContext.jsx` | Contexto de sesión con organizaciones |
| `sdd/spec_config.md` | Esta especificación |
