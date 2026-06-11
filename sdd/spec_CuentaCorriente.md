# SDD - Cuenta Corriente

## Especificación del Módulo de Cuenta Corriente

**Versión:** 0.1
**Fecha:** 11/06/2026
**Propósito:** Definir el alcance y la arquitectura de la funcionalidad de Cuenta Corriente, limitada exclusivamente a entidades de tipo Cliente.

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

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `habilitado` | boolean | Switch que activa/desactiva la Cta Cte para el cliente |
| `importeMaximo` | number | Tope máximo de saldo permitido (Input numérico) |
| `plazoDias` | number | Plazo máximo en días para el saldo (Input numérico) |

### 2.1 Dónde se configura

- **Formulario de Cliente** (`EntidadForm.jsx`): sección "Cuenta Corriente" con switch + campos
- Solo visible cuando `isCliente === true`
- Los campos `importeMaximo` y `plazoDias` usan `<Input type="number" inputMode="numeric">`

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

## 3. Visualización en Listado

En el listado de Clientes (`EntidadesListado.jsx`), los clientes con Cta Cte habilitada muestran:

- **Tag "CTA CTE"** junto al nombre
- **Saldo calculado** en base a movimientos con `formaPago === "Cta Corriente"`
- **Alertas visuales**:
  - `Superó límite` (⚠️ amarillo) si `|saldo| > importeMaximo`
  - `Plazo vencido` (🔴 rojo) si hay movimientos cuya fecha más antigua supera `plazoDias`

### 3.1 Cálculo de saldo

```
saldo = Σ(Ventas) - Σ(Cobros/Pagos)
```

Se filtran movimientos con `formaPago === "Cta Corriente"` y `entidad.id === clienteId`.

---

## 4. Reporte de Cuenta Corriente

El reporte (`/reportes/ctacte`) muestra exclusivamente **Clientes** con saldo <> 0.

> **Nota:** En versiones anteriores el reporte incluía tabs de Clientes y Proveedores. A partir de v0.2 solo muestra Clientes, alineado con la decisión de que Cta Cte es solo para Clientes.

### 4.1 Modal Detalle

Al clickear un cliente en el reporte, se abre un modal con:
- Nombre del cliente + saldo actual
- Últimos 20 movimientos de Cta Cte
- Botón de eliminar movimiento individual

---

## 5. Gestión de Cta Cte desde Entidad

- **Alta/Edición**: desde el formulario de Cliente (sección Cuenta Corriente)
- **Vista de detalle** (futuro): desde la vista de entidad, con saldo y movimientos
- **Acciones** (futuro): botón "Registrar pago" → POS con tipo Cobro para clientes con Cta Cte

---

## 6. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/Entidades/components/EntidadDetalle/components/EntidadForm.jsx` | Formulario con sección Cta Cte (solo Clientes) |
| `src/pages/Entidades/components/EntidadesListado.jsx` | Listado con indicadores de Cta Cte y alertas |
| `src/services/entidadService.js` | CRUD que incluye `ctaCteConfig` en el objeto cliente |
| `src/pages/Reportes/ReporteCtaCte.jsx` | Reporte de saldos de Cta Cte (solo Clientes) |
| `src/pages/Reportes/components/ModalDetalleCtaCte.jsx` | Modal con detalle de movimientos |
| `sdd/spec_rxp_Cta_Cte.md` | Especificación del reporte de Cta Cte |
