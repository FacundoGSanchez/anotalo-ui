# SDD - Reporte Caja (RPX)

## Especificación del Reporte de Movimientos de Caja

**Versión:** 0.1
**Fecha:** 07/06/2026
**Propósito:** Definir la estructura del reporte de movimientos de caja, incluyendo el concepto de cierre (snapshot del saldo) y el listado cronológico de movimientos que impactan caja.

---

## 1. Concepto

El Reporte de Caja muestra todos los movimientos cuyo `formaPago` tiene `impactaCaja = true` (configurable por organización). Incorpora el concepto de **Cierre**: un registro que captura el saldo actual de caja en un momento determinado, permitiendo auditoría y conciliación.

### 1.1 Relaciones

```
Movimiento ── tiene ──> formaPago (con impactaCaja = true)
Cierre ── captura ──> saldo actual en ese momento
Cierre ── registra ──> usuario que realizó el cierre
```

---

## 2. Estructura de la Página

```
┌─────────────────────────────────────────────┐
│  REPORTE CAJA                        [⋯]    │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐│
│  │  SALDO DE CAJA                          ││
│  │  $ 15,000.00                            ││
│  │  [🔒 Registrar Cierre]                  ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Hoy (o fecha)                              │
│  ┌─────────────────────────────────────────┐│
│  │ [V] Venta · Efectivo   +$5,000  $15K   ││
│  │ [P] Pago  · Efectivo   -$2,000  $10K   ││
│  │ [I] Ingreso · Efectivo  +$1,000  $12K  ││
│  │ ─────────────────────────────────────── ││
│  │ [C] Cierre               $12K   $12K    ││  ← Fondo amarillo
│  │    12/06 10:30 hs · Admin        🗑️    ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

---

## 3. Componentes

### 3.1 Página Principal: `ReporteCaja.jsx`

| Elemento | Descripción |
|----------|-------------|
| Header | Título "Reporte Caja" + botón ⋯ (acciones futuras) |
| Saldo actual | Card destacado con el saldo calculado en tiempo real |
| Botón Cierre | Crea un snapshot del saldo actual con usuario y timestamp |
| Lista de entradas | Movimientos + Cierres combinados en orden cronológico inverso |
| Balance corrido | Cada entrada muestra el saldo acumulado hasta ese punto |

### 3.2 Cada entrada de movimiento

| Campo | Descripción |
|-------|-------------|
| Tag tipo | V (Venta), P (Pago), I (Ingreso), R (Retiro) con color |
| Tipo | Nombre del tipo de movimiento |
| Forma de pago | Nombre de la forma de pago (ej: Efectivo) |
| Fecha/Hora | Timestamp del registro |
| Usuario | Quién registró el movimiento |
| Importe | +$X (entrada, verde) o -$X (salida, rojo) |
| Balance | Saldo acumulado después de este movimiento |
| 🗑️ | Eliminar movimiento |

### 3.3 Cada entrada de cierre

| Campo | Descripción |
|-------|-------------|
| Tag | "C" con color amarillo |
| Label | "Cierre" |
| Fecha/Hora | Timestamp del cierre |
| Usuario | Quién registró el cierre |
| Saldo | Saldo al momento del cierre |
| Fondo | Amarillo claro para distinguir de movimientos |
| 🗑️ | Eliminar cierre |

---

## 4. Comportamiento

### 4.1 Cálculo del saldo

```
balance = 0
para cada movimiento (orden ascendente por id):
  si es Venta o Ingreso → balance += importe
  si es Pago o Retiro   → balance -= importe
```

### 4.2 Cierre

Al hacer clic en "Registrar Cierre":
1. Calcula el saldo actual recorriendo todos los movimientos que impactan caja
2. Guarda en `cierreService.save(saldo, user)` con timestamp
3. El cierre aparece en la lista con fondo amarillo
4. El saldo de cierre queda inmodificable (solo se puede eliminar el registro)

### 4.3 Actualización en tiempo real

- Escucha evento `local-db-update` para refrescar la lista automáticamente
- Al eliminar un movimiento o cierre, se recalcula todo

---

## 5. Filtros

(No implementados en v0.1 — futuros: filtro por fecha, solo cierres, solo movimientos)

---

## 6. Servicios

### `cierreService.js`

| Método | Descripción |
|--------|-------------|
| `getAll()` | Retorna todos los cierres |
| `save(saldo, user)` | Crea un nuevo cierre con timestamp y usuario |
| `deleteById(id)` | Elimina un cierre |

### Datos del cierre

```js
{
  id: number,         // Date.now()
  fecha: string,      // YYYY-MM-DD (Argentina)
  hora: string,       // HH:mm (Argentina)
  saldo: number,      // Saldo de caja al momento del cierre
  usuario: string,    // Nombre del usuario que registró
}
```

---

## 7. Formas de Pago que Impactan Caja

La determinación de qué movimientos entran en el reporte depende de la configuración de la organización:

1. Se obtienen las formas de pago configuradas para la org (`orgService.getFormasPago(orgId, tipo)`)
2. Se filtran aquellas con `impactaCaja = true`
3. Se buscan movimientos cuya `formaPago` coincida con las claves filtradas

Por defecto, solo `Efectivo` tiene `impactaCaja = true`.

---

## 8. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/Reportes/ReporteCaja.jsx` | Página principal del reporte |
| `src/services/cierreService.js` | Servicio de cierres de caja |
| `src/services/orgService.js` | Config de formas de pago (impactaCaja) |
| `src/constants/posConstants.js` | Formas de pago default |
| `sdd/spec_rpx_Caja.md` | Esta especificación |
| `sdd/spec_config.md` | Configuración por organización |
