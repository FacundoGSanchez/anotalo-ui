# SDD - Admin Caja

## Especificación del Módulo de Administración de Caja

**Versión:** 0.2
**Fecha:** 13/06/2026
**Propósito:** Definir la estructura de la página de administración de caja, incluyendo el registro de ingresos/retiros manuales, el concepto de cierre (snapshot del saldo) y el listado cronológico de movimientos que impactan caja.

---

## 1. Concepto

La página **Admin Caja** permite gestionar los movimientos de caja física. Muestra todos los movimientos cuya `formaPago` tiene `impactaCaja = true` (configurable por organización). Incorpora:

- **Ingreso/Retiro manual**: registrar movimientos de ajuste de caja (solo Efectivo)
- **Cierre**: snapshot del saldo actual con timestamp y usuario
- **Listado**: movimientos + cierres combinados en orden cronológico inverso con balance corrido

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
│  ← Admin Caja                               │
├─────────────────────────────────────────────┤
│  [Ingreso]     [Retiro]                     │
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

### 3.1 Página Principal: `AdminCajaPage.jsx`

| Elemento | Descripción |
|----------|-------------|
| Header | Flecha volver + título "Admin Caja" (sin botón ⋯) |
| Botón Ingreso | Acceso directo para registrar ingreso manual con monto y observación vía modal con calculadora |
| Botón Retiro | Acceso directo para registrar retiro manual (egreso) con monto y observación vía modal con calculadora |
| Saldo actual | Card destacado con el saldo calculado en tiempo real |
| Botón Cierre | Crea un snapshot del saldo actual con usuario y timestamp (misma altura que botones Ingreso/Retiro) |
| Lista de entradas | Movimientos + Cierres combinados en orden cronológico inverso |
| Balance corrido | Cada entrada muestra el saldo acumulado hasta ese punto |

### 3.2 Cada entrada de movimiento

| Campo | Descripción |
|-------|-------------|
| Tag tipo | Letra inicial con color del tipo: **V** (Venta), **P** (Pago), **I** (Ingreso), **R** (Retiro) — tamaño 14px |
| Tipo | Nombre del tipo de movimiento |
| Forma de pago | Nombre de la forma de pago (ej: Efectivo) |
| Fecha/Hora | Timestamp del registro |
| Usuario | Quién registró el movimiento |
| Importe | +$X (entrada, verde) o -$X (salida, rojo) |
| Balance | Saldo acumulado después de este movimiento |
| 🗑️ | Eliminar movimiento (con confirmación) |

### 3.3 Cada entrada de cierre

| Campo | Descripción |
|-------|-------------|
| Tag | **C** con color amarillo — tamaño 14px |
| Label | "Cierre" |
| Fecha/Hora | Timestamp del cierre |
| Usuario | Quién registró el cierre |
| Saldo | Saldo al momento del cierre |
| Fondo | Amarillo claro para distinguir de movimientos |
| 🗑️ | Eliminar cierre (con confirmación) |

### 3.4 Modal de Ingreso/Retiro

| Elemento | Descripción |
|----------|-------------|
| Título | "Ingreso" o "Retiro" según el tipo |
| Saldo actual | Indicador del saldo previo |
| Visor | Display del monto ingresado |
| Teclado | Grid numérico táctil (0-9, 00, borrar) |
| Botón registrar | "Registrar Ingreso" o "Registrar Retiro" — deshabilitado si monto ≤ 0 |

---

## 4. Comportamiento

### 4.1 Cálculo del saldo

```
balance = 0
para cada movimiento (orden ascendente por id):
  si es Venta, Ingreso o Cobro → balance += importe
  si es Pago o Retiro          → balance -= importe
```

### 4.2 Cierre

Al hacer clic en "Registrar Cierre":
1. Calcula el saldo actual recorriendo todos los movimientos que impactan caja
2. Guarda en `cierreService.save(saldo, user)` con timestamp
3. El cierre aparece en la lista con fondo amarillo
4. El saldo de cierre queda inmodificable (solo se puede eliminar el registro)

### 4.3 Ingreso/Retiro manual

- Se abre un modal con calculadora numérica táctil
- El usuario ingresa el monto y opcionalmente una observación
- Al confirmar se crea un movimiento con:
  - `tipo`: "Ingreso" o "Retiro"
  - `formaPago`: "Efectivo" (fijo, siempre impacta caja)
  - `entidad`: `{ id: 0, nombre: "Caja Interna" }`
- Se persiste vía `movimientoService.save()`

### 4.4 Actualización en tiempo real

- Escucha evento `local-db-update` para refrescar la lista automáticamente
- Al eliminar un movimiento o cierre, se recalcula todo

---

## 5. Filtros

(No implementados en v0.2 — futuros: filtro por fecha, solo cierres, solo movimientos)

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
| `src/pages/Gestiones/AdminCaja/AdminCajaPage.jsx` | Página principal de administración de caja |
| `src/services/cierreService.js` | Servicio de cierres de caja |
| `src/services/orgService.js` | Config de formas de pago (impactaCaja) |
| `src/services/movimientoService.js` | Persistencia de movimientos |
| `src/constants/posConstants.js` | Formas de pago default y constantes |
| `sdd/spec_admin_Caja.md` | Esta especificación |
| `sdd/spec_config.md` | Configuración por organización |
