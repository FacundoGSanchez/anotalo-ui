# SDD - Cuentas Corrientes

## Especificación del Módulo de Cuenta Corriente para Clientes

**Propósito:** Definir el alcance, configuración, administración y reporte de cuenta corriente, exclusivo para Clientes. No se administra cuenta corriente para Proveedores.

---

## 1. Alcance

La funcionalidad de **Cuenta Corriente** está disponible **únicamente para Clientes**. No aplica a Proveedores.

### 1.1 Justificación

- Los clientes pueden tener saldos a favor o en contra según sus compras y pagos (cuenta corriente clásica)
- Los proveedores manejan una lógica distinta (órdenes de compra, facturas pendientes de pago) que se gestionará en el módulo Pedidos
- Simplifica la UI al mostrar opciones de Cta Cte solo cuando corresponden

---

## 2. Configuración por Cliente

Cada cliente puede tener habilitada o no la cuenta corriente. Si está habilitada, se configuran:

| Campo           | Tipo    | Descripción                                            |
| --------------- | ------- | ------------------------------------------------------ |
| `habilitado`    | boolean | Switch que activa/desactiva la Cta Cte para el cliente |
| `importeMaximo` | number  | Tope máximo de saldo permitido (Input numérico)        |
| `plazoDias`     | number  | Plazo máximo en días para el saldo (Input numérico)    |

### 2.1 Dónde se configura

- **Formulario de Cliente** (`EntidadForm.jsx`): sección "Cuenta Corriente" con switch + campos
- Solo visible cuando `isCliente === true`
- Los campos `importeMaximo` y `plazoDias` usan `<InputNumber>` (solo números)
- Las condiciones también se administran desde la página de detalle de Cta Cte (`DetalleCtaCtePage.jsx`) mediante un modal inline (botón ⚙️)

### 2.2 Almacenamiento

Los datos de Cta Cte se guardan dentro del objeto del cliente en `db_clientes`:

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "telefono": "3511234567",
  "ctaCteConfig": {
    "habilitado": true,
    "importeMaximo": 50000,
    "plazoDias": 30
  },
  "activo": true
}
```

---

## 3. Visualización en Listado de Entidades

En el listado de Clientes (`EntidadesListado.jsx`), los clientes con Cta Cte habilitada muestran:

- **Tag "CTA CTE"** junto al nombre
- **Saldo calculado** en base a movimientos con `formaPago === "Cta Corriente"`
- **Alertas visuales**:
  - `Configurar cuenta` (🔴 rojo) si no tiene `ctaCteConfig.habilitado`
  - `Superó límite` (⚠️ amarillo) si `|saldo| > importeMaximo`
  - `Plazo vencido` (🔴 rojo) si hay movimientos cuya fecha más antigua supera `plazoDias`

### 3.1 Cálculo de saldo

```
saldo = Σ(Ventas) - Σ(Cobros/Pagos)
```

Se filtran movimientos con `formaPago === "Cta Corriente"` y `entidad.id === clienteId`.

---

## 4. Administración de Cuenta Corriente

### 4.1 Página Principal: `AdminCtaCtePage.jsx`

Ruta: `/gestiones/ctacte`

```
┌─────────────────────────────────────┐
│  ← Cuentas Corrientes               │
├─────────────────────────────────────┤
│                                      │
│  Solo pendientes  ○───────────────── │
│                                      │
│  🔍 Buscar por nombre...            │
│                                      │
│  ┌─────────────────────────────────┐│
│  │ Juan Pérez       Superó límite  ││
│  │              +$15,000           ││
│  ├─────────────────────────────────┤│
│  │ María García    Configurar      ││
│  │              +$8,200            ││
│  ├─────────────────────────────────┤│
│  │ Carlos López    Plazo vencido   ││
│  │              +$3,500            ││
│  └─────────────────────────────────┘│
│                                      │
│  Click en fila → Página detalle     │
└─────────────────────────────────────┘
```

| Elemento        | Descripción                                                                    |
| --------------- | ------------------------------------------------------------------------------ |
| Título          | "Cuentas Corrientes"                                                           |
| Switch          | "Solo pendientes" — filtra clientes con saldo > 0 (nos deben)                  |
| Listado         | Clientes con movimientos Cta Corriente (con o sin config habilitada)           |
| Orden           | Por saldo descendente (mayor deuda primero)                                    |
| Búsqueda        | Input que filtra por nombre del cliente                                        |
| Saldo           | Signo + verde (a favor), signo - rojo (nos debe)                               |
| Alertas         | "Configurar cuenta" (rojo), "Superó límite" (amarillo), "Plazo vencido" (rojo) |
| Click fila      | Navega a `/gestiones/ctacte/clientes/{id}` (detalle + cobro + config)          |

Nota: No se muestran Tope ni Plazo en la card del listado. Esa información se ve en la página de detalle.

### 4.2 Página Detalle: `DetalleCtaCtePage.jsx`

Ruta: `/gestiones/ctacte/clientes/{id}`

```
┌─────────────────────────────────────┐
│  ← Juan Pérez            [⚙️] [💰] │
├─────────────────────────────────────┤
│                                     │
│         SALDO ACTUAL                │
│          $15,000.00                 │
│       Nos debe $15,000.00           │
│  Tope: $50,000 · Plazo: 30 días    │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ ÚLTIMOS MOVIMIENTOS           │  │
│  │                               │  │
│  │ [V] Venta Producto   +$5,000  │  │
│  │ [C] Cobro           -$2,000   │  │
│  │ [V] Venta Producto   +$1,000  │  │
│  │                     ...   🗑️ │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

| Elemento          | Descripción                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| Header            | Nombre del cliente + botón ⚙️ size=24 (config) + botón 💰 size=24 (cobro)              |
| Saldo actual      | Visible y destacado con leyenda "Nos debe" / "A favor"                 |
| Tope / Plazo      | Mostrado siempre debajo del saldo (0/0 si no hay config)               |
| Botón Config ⚙️   | Abre modal inline para editar Tope (importeMaximo) y Plazo (plazoDias) |
| Botón Cobro 💰    | Abre modal de 2 pasos: importe → forma de pago                        |
| Lista movimientos | Últimos 20 movimientos del cliente (Cta Cte + Cobros)                  |
| Cada movimiento   | Tipo (tag), Importe (Cta Cte si es parcial, con referencia al total), Fecha, Hora |
| Botón eliminar    | Delete de cada movimiento individual                                   |

#### 4.2.1 Modal de Configuración (⚙️)

```
┌─────────────────────────────┐
│ Configuración Cta Cte       │
│ ─────────────────────────── │
│                             │
│ Tope Cuenta Corriente       │
│ ┌─────────────────────────┐ │
│ │ $ 50000                 │ │
│ └─────────────────────────┘ │
│                             │
│ Plazo (días)                │
│ ┌─────────────────────────┐ │
│ │ 30              días    │ │
│ └─────────────────────────┘ │
│                             │
│        [Cancelar] [Guardar] │
└─────────────────────────────┘
```

- Tope: `InputNumber` con formateo `$` y separador de miles
- Plazo: `InputNumber` con min=1, suffix "días"
- Al guardar: llama a `entidadService.saveCtaCteConfig` y refresca la página
- Dispara evento `local-db-update` para que el listado se actualice al volver

#### 4.2.2 Modal de Cobro (💰) — 2 pasos

**Paso 1 — Importe:** teclado numérico con visor. Botón "Continuar".

**Paso 2 — Forma de pago:** muestra el importe a cobrar y una grilla con los medios de pago disponibles para `tipo="Cobro"` (excluye "Cta Corriente"). Al seleccionar una forma de pago se guarda el movimiento con esa `formaPago`.

```
┌─────────────────────────────┐
│ Forma de pago               │
│ ─────────────────────────── │
│                             │
│    Importe a cobrar         │
│       $ 15.000              │
│                             │
│  ┌───────────────────────┐  │
│  │ 💵 Efectivo           │  │
│  ├───────────────────────┤  │
│  │ 💳 Tarjeta            │  │
│  ├───────────────────────┤  │
│  │ 📱 QR                 │  │
│  ├───────────────────────┤  │
│  │ 🔄 Transferencia      │  │
│  └───────────────────────┘  │
│                             │
│         ← Atrás             │
└─────────────────────────────┘
```

- El movimiento se guarda con `tipo="Cobro"` y la `formaPago` seleccionada
- El balance de Cta Cte se actualiza igualmente (todo Cobro contra el cliente reduce su saldo, independientemente de la forma de pago)

### 4.3 Filtros

### 4.3 Filtros

| Filtro            | Tipo     | Descripción                                                    |
| ----------------- | -------- | -------------------------------------------------------------- |
| Búsqueda          | Input    | Filtra clientes por nombre (case-insensitive)                  |
| Solo pendientes   | Switch   | Cuando está activo, muestra solo clientes con `saldo > 0` (nos deben) |

- El listado siempre trae **todos los clientes que alguna vez usaron Cta Corriente**, independientemente de su saldo actual.
- El switch "Solo pendientes" oculta los clientes con saldo `<= 0`.
- El orden por defecto es **saldo descendente** (mayor deuda al inicio).

---

## 5. Gestión de Cta Cte desde Entidad

- **Edición de condiciones**: desde el botón ⚙️ en `DetalleCtaCtePage.jsx` → modal inline de Tope/Plazo
- **Alta**: desde el módulo Entidades (`/entidades/clientes/nuevo`), sección "Cuenta Corriente" en el formulario
- **Registro de cobro**: desde la página de detalle (`DetalleCtaCtePage.jsx`)
- **Acciones futuras**: compartir, descargar reporte

---

## 6. Auth y almacenamiento

### 6.1 Limpieza de datos al cerrar sesión

Al llamar a `authService.logout()`:

- Se eliminan todas las claves de app de localStorage: `auth_token`, `auth_user`, `current_org_id`, `movimientos_db`, `cierres_db`, todas las `db_*` y `org_config_*`
- Garantiza que al iniciar sesión nuevamente se parta de un estado limpio

### 6.2 Orgs mockeadas

Cuando se usa el modo mock (sin `VITE_API_URL`), la org no persiste `formasPago` en localStorage. `orgService.getFormasPago` retorna directamente la constante `FORMAS_PAGO` definida en `posConstants.jsx`, que es la fuente de verdad para propiedades como `impactaCtaCte`, `impactaCaja`, etc.

---

## 7. Archivos involucrados

| Archivo                                                                    | Rol                                                                     |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/pages/Entidades/components/EntidadDetalle/components/EntidadForm.jsx` | Formulario con sección Cta Cte (solo Clientes)                          |
| `src/pages/Entidades/components/EntidadesListado.jsx`                      | Listado con indicadores de Cta Cte y alertas                            |
| `src/pages/Gestiones/AdminCtaCte/AdminCtaCtePage.jsx`                      | Página principal de admin Cta Cte (listado + saldos + alertas)          |
| `src/pages/Gestiones/AdminCtaCte/DetalleCtaCtePage.jsx`                    | Página detalle con movimientos, registro de cobro y config ⚙️           |
| `src/services/entidadService.js`                                           | CRUD que incluye `ctaCteConfig` en el objeto cliente                    |
| `src/services/movimientoService.js`                                        | Servicio de movimientos con cálculo de saldo Cta Cte                    |
| `src/services/authService.js`                                              | Login/logout con limpieza de localStorage                               |
| `src/services/orgService.js`                                               | Config de org con fallback a `FORMAS_PAGO` constante                    |
| `src/constants/posConstants.jsx`                                           | Constantes (key `"Cta Corriente"` con properties `impactaCtaCte`, etc.) |
| `sdd/spec_admin_CtaCte.md`                                                 | Esta especificación                                                     |

