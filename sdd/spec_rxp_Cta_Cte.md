# SDD - Reporte Cuenta Corriente (RPX)

## Especificación del Reporte de Cuenta Corriente

**Versión:** 0.1
**Fecha:** 07/06/2026
**Propósito:** Definir la estructura del reporte de cuenta corriente, con tabs por tipo de entidad, listado de saldos y detalle de movimientos.

---

## 1. Estructura General

```
┌─────────────────────────────────────────────┐
│  CUENTA CORRIENTE                    [⋯]    │
├─────────────────────────────────────────────┤
│  ┌──────────┬──────────┐                    │
│  │Clientes  │Proveed.  │  ← Tabs           │
│  ├──────────┴──────────┤                    │
│  │                     │                    │
│  │  ┌─────────────────┐│                    │
│  │  │ Cliente A    $5K ││  ← Lista de      │
│  │  │ Cliente B   $12K ││     entidades     │
│  │  │ Cliente C   -$2K ││     con saldo     │
│  │  └─────────────────┘│                    │
│  │                     │                    │
│  │  Click en entidad → │  Modal detalle     │
│  └─────────────────────┘                    │
└─────────────────────────────────────────────┘
```

---

## 2. Componentes

### 2.1 Página Principal: `ReporteCtaCte.jsx`

| Elemento | Descripción |
|----------|-------------|
| Tabs | Clientes / Proveedores |
| Listado | Entidades con nombre y saldo actual (solo saldo <> 0) |
| Botón ⋯ | Acciones futuras: compartir, descargar, admin condiciones |

### 2.2 Modal Detalle: `ModalDetalleCtaCte.jsx`

| Elemento | Descripción |
|----------|-------------|
| Header | Nombre de la entidad en grande |
| Saldo actual | Visible y destacado |
| Lista movimientos | Últimos 20 movimientos de la entidad |
| Cada movimiento | Tipo (tag), Importe, Fecha, FormaPago |
| Botón eliminar | Delete de cada movimiento individual |

---

## 3. Tabs

### 3.1 Clientes

```
┌─────────────────────────────────────┐
│  Clientes (12)                      │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Juan Pérez         +$15,000  │   │
│  │ María García       +$8,200   │   │
│  │ Carlos López       +$3,500   │   │
│  │ Ana Rodríguez      -$1,200   │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 3.2 Proveedores

```
┌─────────────────────────────────────┐
│  Proveedores (8)                    │
│                                     │
│  ┌──────────────────────────────┐   │
│  │ Distribuidora ABC   +$22,000 │   │
│  │ Proveedor XYZ       +$5,400  │   │
│  │ Suministros SA      +$1,200  │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 4. Modal de Detalle

```
┌─────────────────────────────────────┐
│  ┌───────────────────────────────┐  │
│  │  Juan Pérez                   │  │  ← Nombre grande
│  │  Saldo: +$15,000              │  │  ← Saldo destacado
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [V] Venta Producto   +$5,000  │  │  ← Últimos 20
│  │ [P] Pago Servicio    -$2,000  │  │     movimientos
│  │ [I] Ingreso Caja     +$1,000  │  │
│  │ [R] Retiro Banco     -$500    │  │
│  │                     ...       │  │
│  │                        🗑️    │  │  ← Delete c/u
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 5. Filtros

No hay filtros por ahora. El reporte muestra todas las entidades con saldo <> 0.

---

## 6. Condiciones de Cuenta Corriente

Cada entidad tendrá condiciones configurables:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `alertaDiasVencimiento` | number | Días antes del vencimiento para alertar |
| `plazoMaximo` | number | Plazo máximo en días |
| `cantidadMaxima` | number | Monto máximo permitido |
| `periodicidadPago` | string | periodicidad (semanal, quincenal, mensual) |

> Futuro: Administrar condiciones desde el botón ⋯

---

## 7. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/Reportes/ReporteCtaCte.jsx` | ⬜ Página principal con tabs |
| `src/pages/Reportes/components/ModalDetalleCtaCte.jsx` | ⬜ Modal detalle movimientos |
| `src/services/reporteService.js` | ⬜ Servicio de reportes |
| `sdd/spec_rxp_Cta_Cte.md` | Esta especificación |
