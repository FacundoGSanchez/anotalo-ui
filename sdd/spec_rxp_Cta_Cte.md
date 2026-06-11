# SDD - Reporte Cuenta Corriente (RPX)

## Especificación del Reporte de Cuenta Corriente

**Versión:** 0.2
**Fecha:** 11/06/2026
**Propósito:** Definir la estructura del reporte de cuenta corriente, exclusivo para Clientes. No se administra cuenta corriente para Proveedores.

---

## 1. Estructura General

```
┌─────────────────────────────────────┐
│  CUENTA CORRIENTE            [⋯]    │
├─────────────────────────────────────┤
│  Clientes                           │  ← Solo Clientes (sin tabs)
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Cliente A                  $5K  ││  ← Lista de clientes
│  │ Cliente B                 $12K  ││     con saldo <> 0
│  │ Cliente C                -$2K   ││
│  └─────────────────────────────────┘│
│                                     │
│  Click en entidad → Modal detalle   │
└─────────────────────────────────────┘
```

---

## 2. Componentes

### 2.1 Página Principal: `ReporteCtaCte.jsx`

| Elemento | Descripción |
|----------|-------------|
| Título | "Cuenta Corriente" |
| Listado | Clientes con nombre y saldo actual (solo saldo <> 0) |
| Botón ⋯ | Acciones futuras: compartir, descargar, admin condiciones |

> **Nota:** No hay tabs Clientes/Proveedores. El reporte muestra solo Clientes con saldo de cuenta corriente.

### 2.2 Modal Detalle: `ModalDetalleCtaCte.jsx`

| Elemento | Descripción |
|----------|-------------|
| Header | Nombre del cliente en grande |
| Saldo actual | Visible y destacado |
| Lista movimientos | Últimos 20 movimientos del cliente |
| Cada movimiento | Tipo (tag), Importe, Fecha, FormaPago |
| Botón eliminar | Delete de cada movimiento individual |

---

## 3. Listado de Clientes

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

Solo se muestran clientes con `saldo <> 0`.

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

No hay filtros por ahora. El reporte muestra todos los clientes con saldo <> 0.

---

## 6. Condiciones de Cuenta Corriente

Cada cliente tendrá condiciones configurables desde el formulario de entidad:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `habilitado` | boolean | Activa/desactiva la Cta Cte para el cliente |
| `importeMaximo` | number | Monto máximo permitido (Input numérico) |
| `plazoDias` | number | Plazo máximo en días (Input numérico) |
| `alertaDiasVencimiento` | number | (Futuro) Días antes del vencimiento para alertar |
| `periodicidadPago` | string | (Futuro) periodicidad (semanal, quincenal, mensual) |

> **Nota:** Las condiciones se administran desde el formulario de Cliente, no desde el reporte.

---

## 7. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/Reportes/ReporteCtaCte.jsx` | ⬜ Página principal (solo Clientes) |
| `src/pages/Reportes/components/ModalDetalleCtaCte.jsx` | ⬜ Modal detalle movimientos |
| `src/services/reporteService.js` | ⬜ Servicio de reportes |
| `sdd/spec_CuentaCorriente.md` | Especificación general del módulo Cta Cte |
| `sdd/spec_rxp_Cta_Cte.md` | Esta especificación |
