# SDD - Reporte Movimientos (RPX)

## Especificación del Reporte de Movimientos

**Versión:** 0.1
**Fecha:** 07/06/2026
**Propósito:** Definir la especificación del reporte detallado de movimientos con formato RPX, aplicable a todos los módulos de reportes del sistema.

---

## 1. Convención de Nomenclatura

Cada reporte tendrá su propia especificación con el prefijo `spec_rpx_`:

| Reporte | Archivo Spec |
|---------|-------------|
| Reporte de Caja | `spec_rpx_caja.md` |
| Cuenta Corriente | `spec_rpx_ctacte.md` |
| Movimientos por Tipo | `spec_rpx_movimientos.md` |
| (futuros) | `spec_rpx_{modulo}.md` |

---

## 2. Formato de Visualización

### 2.1 Línea de Información

Cada movimiento en el listado debe mostrar en una misma línea:

```
{Forma de Pago} | {HH:mm} hs
```

**Reglas:**
- La forma de pago y la hora se renderizan en la misma línea
- Separadas por el caracter ` | ` (espacio-pipe-espacio)
- La hora se obtiene del campo `hora` del movimiento (no de `dayjs(fecha)` para evitar 00:00)
- Se omite el label `hs` si la hora no está disponible

### 2.2 Cards de Tipo de Movimiento

Todos los tipos de movimiento deben usar el mismo formato de card:
- Formato horizontal (full width) con ícono a la derecha
- Label y descripción visibles
- Color dinámico según el tipo

---

## 3. Estructura del Reporte

```
┌─────────────────────────────────────────────┐
│  RPX - MOVIMIENTOS                          │
│  [Filtros: Fecha, Tipo, Forma de Pago]      │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  FECHA (Agrupador)        Subtotal $X│   │
│  ├──────────────────────────────────────┤   │
│  │  [T] Entidad                         │   │
│  │  FormaPago | HH:mm hs        $99,999 │   │
│  │                                      │   │
│  │  [T] Entidad                         │   │
│  │  FormaPago | HH:mm hs        $99,999 │   │
│  └──────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 4. Componentes

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| `HeaderMovimientos` | `HeaderMovimientos.jsx` | Header con filtros (sin botón "Nuevo", acceso POS vía BottomNav) |
| `MovimientoGrupo` | `MovimientoGrupo.jsx` | Grupo de movimientos por fecha con subtotal |
| `ModalDetalleMovimiento` | `ModalDetalleMovimiento.jsx` | Modal con detalle completo del movimiento |

---

## 5. Rutas

| Ruta | Componente | Estado |
|------|-----------|--------|
| `/reportes/movimientos` | `ReporteMovimientos.jsx` | ⬜ Pendiente |
| `/movimientos` | `MovimientosPage.jsx` | ✅ Actual |

---

## 6. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/Movimientos/components/MovimientoGrupo.jsx` | Renderiza grupo de movimientos con formato RPX |
| `src/pages/Movimientos/components/ModalDetalleMovimiento.jsx` | Detalle de movimiento individual |
| `sdd/spec_rpx_movimientos.md` | Esta especificación |
