# SDD - Reportes

## Especificación de Módulo de Reportes

**Versión:** 0.2
**Fecha:** 07/06/2026
**Propósito:** Definir la arquitectura del módulo de reportes, los tipos de reporte, su estructura, filtros y plan de implementación progresiva.

---

## 1. Visión General

El módulo de Reportes centraliza la visualización analítica de los datos del sistema. Se accede desde el dashboard y desde el menú principal. Cada reporte es una página independiente con filtros, visualización de datos y opciones de exportación.

### 1.1 Reportes Planificados

| Reporte | Ruta | Prioridad | Estado |
|---------|------|-----------|--------|
| Reporte de Caja | `/reportes/caja` | 🔴 Alta | ⬜ Pendiente (acceso desde dashboard listo) |
| Cta Corriente | `/reportes/ctacte` | 🔴 Alta | ⬜ Pendiente (acceso desde dashboard listo) |
| Movimientos por Tipo/FormaPago | `/reportes/movimientos` | 🟡 Media | ⬜ Pendiente (acceso desde dashboard listo) |
| Reportes existente (MovimientosPage) | `/movimientos` | ✅ | Actual |

> El listado actual de movimientos (`/movimientos`) se conserva como herramienta de consulta diaria. Los reportes agregan capas de agregación, filtros por fecha y cálculos de saldos.

---

## 2. Estructura de Rutas

```
/reportes                     → ReportesIndex (listado con accessos)
/reportes/caja                → ReporteCaja
/reportes/ctacte              → ReporteCtaCte
/reportes/movimientos         → ReporteMovimientos
```

### 2.1 ReportesIndex — Página de listado

```
┌─────────────────────────────────────┐
│  Reportes                           │
│                                     │
│  ┌────────────────────────────────┐ │
│  │ 🏦 Reporte de Caja             │ │
│  │ Arqueo y movimientos de efectivo│ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 📋 Cuenta Corriente            │ │
│  │ Saldos de clientes/proveedores  │ │
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 📊 Movimientos x Tipo          │ │
│  │ Resumen por tipo y forma pago   │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 3. Reporte de Caja

### 3.1 Propósito

Mostrar el arqueo de caja: todos los movimientos con forma de pago **Efectivo**, agrupados por fecha, con cálculo de saldo inicial, ingresos, egresos y saldo final.

### 3.2 Filtros

| Filtro | Tipo | Default |
|--------|------|---------|
| Fecha desde | DatePicker | Hoy - 7 días |
| Fecha hasta | DatePicker | Hoy |
| Usuario | Select (multi) | Todos |
| Tipo movimiento | Select (multi) | Venta + Pago + Ingreso + Retiro |

### 3.3 Estructura del Reporte

```
┌─────────────────────────────────────────┐
│  REPORTE DE CAJA                        │
│  [Fecha desde] [Fecha hasta] [Filtrar]  │
├─────────────────────────────────────────┤
│  SALDO INICIAL                 $ 5,000  │
├─────────────────────────────────────────┤
│  [Fecha]  [Tipo]  [Concepto]  [Importe]│
│  07/06    Venta   Cliente X   +$ 1,500  │
│  07/06    Pago    Proveedor Y  -$ 800   │
│  07/06    Ingreso  Caja Interna +$ 200   │
│                                        │
│  Subtotal del día              +$ 900   │
├─────────────────────────────────────────┤
│  SALDO FINAL                   $ 5,900  │
└─────────────────────────────────────────┘
```

### 3.4 Fórmulas

```
Saldo Inicial = Saldo final del día anterior (o 0 si no hay datos)
Ingresos = Suma de movimientos Efectivo con tipo = Venta o Ingreso
Egresos  = Suma de movimientos Efectivo con tipo = Pago o Retiro
Saldo Final = Saldo Inicial + Ingresos - Egresos
```

### 3.5 Datos mock para desarrollo

```js
// Reporte de caja usa movimientoService.getAll() filtrado por formaPago === "Efectivo"
// No requiere persistencia adicional
```

### 3.6 Componentes necesarios

| Componente | Descripción |
|------------|-------------|
| `ReporteCaja.jsx` | Página principal con filtros y tabla |
| `components/FiltrosFecha.jsx` | Barra de filtros reutilizable |
| `components/TablaMovimientos.jsx` | Tabla de movimientos agrupados |
| `components/ResumenCaja.jsx` | Card con saldo inicial, final y neto |

---

## 4. Reporte de Cuenta Corriente

### 4.1 Propósito

Mostrar el saldo de cuenta corriente de cada cliente y proveedor. Los movimientos con forma de pago **Cta Corriente** se agregan por entidad, mostrando debe, haber y saldo.

### 4.2 Filtros

| Filtro | Tipo | Default |
|--------|------|---------|
| Tipo entidad | Select (Cliente / Proveedor) | Cliente |
| Entidad | Select (búsqueda) | Todas |
| Fecha desde | DatePicker | Sin límite |
| Fecha hasta | DatePicker | Hoy |

### 4.3 Estructura del Reporte

```
┌─────────────────────────────────────────┐
│  CUENTA CORRIENTE                       │
│  [Cliente|Proveedor] [Entidad...]       │
├─────────────────────────────────────────┤
│  Saldo Total Cta Cte:       $ 25,000    │
├─────────────────────────────────────────┤
│  [Entidad]  [Debe]  [Haber]  [Saldo]   │
│  Cliente A  $5,000  $2,000   $3,000     │
│  Cliente B  $10,000 $8,000   $2,000     │
│  Cliente C  $0      $1,000   -$1,000    │
├─────────────────────────────────────────┤
│  → Click en entidad abre detalle       │
└─────────────────────────────────────────┘
```

### 4.4 Fórmulas

```
Para cada entidad:
  Debe   = Suma de movimientos con tipo Venta y formaPago "Cta Corriente"
  Haber  = Suma de movimientos con tipo Pago y formaPago "Cta Corriente"
  Saldo  = Debe - Haber (saldo positivo = debe, negativo = haber)
```

### 4.5 Componentes necesarios

| Componente | Descripción |
|------------|-------------|
| `ReporteCtaCte.jsx` | Página principal |
| `components/FiltrosEntidad.jsx` | Selector de entidad con búsqueda |
| `components/TablaSaldos.jsx` | Tabla de saldos por entidad |
| `components/DetalleEntidad.jsx` | Modal con detalle de movimientos de una entidad |

---

## 5. Reporte de Movimientos por Tipo y Forma de Pago

### 5.1 Propósito

Resumen agregado de movimientos agrupados por tipo y forma de pago, similar al existente en `MovimientosPage` pero con vista de tabla resumen y filtros avanzados.

### 5.2 Filtros

| Filtro | Tipo | Default |
|--------|------|---------|
| Fecha desde | DatePicker | Primer día del mes |
| Fecha hasta | DatePicker | Hoy |
| Tipo | Select (multi) | Todos |
| Forma de pago | Select (multi) | Todas |

### 5.3 Estructura

```
┌─────────────────────────────────────────────┐
│  MOVIMIENTOS POR TIPO Y FORMA DE PAGO       │
│  [Fechas] [Tipo] [FormaPago] [Filtrar]      │
├─────────────────────────────────────────────┤
│  Matriz:                                     │
│               Efectivo  Débito  Crédito  Cta │
│  Ventas       $5,000    $3,000  $2,000  $1K │
│  Pagos        $2,000    $1,000  $500    $300 │
│  Ingresos     $1,000    $0      $0      $0   │
│  Retiros      $500      $0      $0      $0   │
├─────────────────────────────────────────────┤
│  Totales por fila y columna                 │
└─────────────────────────────────────────────┘
```

### 5.4 Componentes necesarios

| Componente | Descripción |
|------------|-------------|
| `ReporteMovimientos.jsx` | Página principal |
| `components/MatrizResumen.jsx` | Tabla de doble entrada (tipo × forma pago) |

---

## 6. Arquitectura de Reportes

### 6.1 Patrón común

```
Reporte{Nombre}.jsx
├── Estado: filtros, datos, loading
├── useEffect: carga datos al montar o cambiar filtros
├── Filtros: componente de filtros (barra o modal)
├── Tabla/Visualización: datos procesados
└── Exportación: botón para copiar/descargar (futuro)
```

### 6.2 Servicio de Reportes (futuro)

```js
// src/services/reporteService.js
export const reporteService = {
  getCaja: (fechaDesde, fechaHasta, usuario) => {
    const movs = movimientoService.getAll();
    return movs.filter(m => m.formaPago === "Efectivo" && /* filtros */);
  },
  getCtaCte: (tipoEntidad, entidadId) => {
    const movs = movimientoService.getAll();
    return movs.filter(m => m.formaPago === "Cta Corriente" && /* filtros */);
  },
  getResumenTipoForma: (fechaDesde, fechaHasta, tipos, formas) => {
    const movs = movimientoService.getAll();
    // Agregar por tipo × formaPago
  },
};
```

### 6.3 Datos: todos los reportes consumen de `movimientoService.getAll()` y `entidadService.getAll()`

No requieren persistencia adicional. Los filtros y agregaciones se hacen en memoria (client-side). Cuando se migre a API, el servicio de reportes hará las consultas al backend.

---

## 7. Menú y Navegación

### 7.1 Nuevo item en MenuItems

```js
{
  key: "reportes",
  icon: <BarChartOutlined />,
  label: "Reportes",
  children: [
    {
      key: "/reportes/caja",
      icon: <DollarOutlined />,
      label: "Caja",
    },
    {
      key: "/reportes/ctacte",
      icon: <BookOutlined />,
      label: "Cta Corriente",
    },
    {
      key: "/reportes/movimientos",
      icon: <PieChartOutlined />,
      label: "Movimientos x Tipo",
    },
  ],
}
```

### 7.2 Nuevas rutas en AppRouter

```js
<Route path="reportes" element={<ReportesIndex />} />
<Route path="reportes/caja" element={<ReporteCaja />} />
<Route path="reportes/ctacte" element={<ReporteCtaCte />} />
<Route path="reportes/movimientos" element={<ReporteMovimientos />} />
```

---

## 8. Roadmap de Implementación

| Fase | Reporte | Archivos | Dependencias |
|------|---------|----------|-------------|
| **Fase 1** | Estructura base | `ReportesIndex.jsx`, ruteo, menú | Ninguna |
| **Fase 1** | Reporte Caja | `ReporteCaja.jsx`, `FiltrosFecha.jsx`, `ResumenCaja.jsx` | movimientoService |
| **Fase 2** | Cta Corriente | `ReporteCtaCte.jsx`, `FiltrosEntidad.jsx`, `TablaSaldos.jsx`, `DetalleEntidad.jsx` | movimientoService, entidadService |
| **Fase 3** | Movimientos x Tipo | `ReporteMovimientos.jsx`, `MatrizResumen.jsx` | movimientoService |
| **Fase 4** | Exportación | Botón copiar CSV, imprimir | — |
| **Fase 5** | Backend API | Migrar reporteService a llamadas HTTP | API .NET |

---

## 9. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/Reportes/ReportesIndex.jsx` | ⬜ Listado de reportes |
| `src/pages/Reportes/ReporteCaja.jsx` | ⬜ Reporte de caja |
| `src/pages/Reportes/ReporteCtaCte.jsx` | ⬜ Reporte cuenta corriente |
| `src/pages/Reportes/ReporteMovimientos.jsx` | ⬜ Reporte mov x tipo |
| `src/pages/Reportes/components/FiltrosFecha.jsx` | ⬜ Filtros reutilizables |
| `src/pages/Reportes/components/TablaMovimientos.jsx` | ⬜ Tabla genérica |
| `src/pages/Reportes/components/ResumenCaja.jsx` | ⬜ Resumen caja |
| `src/pages/Reportes/components/TablaSaldos.jsx` | ⬜ Tabla saldos cta cte |
| `src/pages/Reportes/components/MatrizResumen.jsx` | ⬜ Matriz doble entrada |
| `src/services/reporteService.js` | ⬜ Servicio de reportes |
| `src/data/MenuItems.jsx` | 📝 Agregar sección Reportes |
| `src/router/AppRouter.jsx` | 📝 Agregar rutas de reportes |
