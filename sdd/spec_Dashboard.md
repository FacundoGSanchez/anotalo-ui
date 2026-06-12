# SDD - Dashboard

## Especificación de Dashboard: Accesos Rápidos, Indicadores y Navegación Mobile-First

**Versión:** 0.3
**Fecha:** 11/06/2026
**Propósito:** Definir la arquitectura del dashboard como centro de comando de la aplicación, con enfoque mobile-first, accesos directos a funciones principales y punto de entrada a gestiones.

---

## 1. Propósito del Dashboard

El dashboard es la pantalla principal post-login. Su objetivo es:

1. Proveer **acceso inmediato** a las operaciones más frecuentes (POS, entidades, movimientos)
2. Mostrar **indicadores de contexto** del día con cards compactas
3. Actuar como **hub de navegación** hacia gestiones y módulos de administración
4. Ser **100% mobile-first**: scroll horizontal, cards táctiles, jerarquía visual clara

---

## 2. Estructura del Dashboard

```
┌─────────────────────────────────────┐
│  ┌─── Card: Resumen de Hoy ───────┐ │
│  │  lunes, 07 de junio            │ │  ← Header + Indicadores
│  │                                │ │     en la misma Card
│  │  [VENTAS  ] [PAGOS  ]          │ │     Grid 2x2 con números
│  │  [ $5.000 ] [ $2.000]          │ │     grandes
│  │  [INGRESOS] [RETIROS]          │ │
│  │  [ $1.000 ] [   $0  ]          │ │
│  └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  ACCESOS RÁPIDOS                    │
│  [Venta] [Pago] [Cobro]            │  ← Scroll horizontal
├─────────────────────────────────────┤
│  GESTIONES                          │
│  [Caja] [Cta Cte] [Compras]        │  ← Scroll horizontal
├─────────────────────────────────────┤
│  REPORTES                           │
│  [Movimientos] [Saldo Ctas Ctes]   │  ← Scroll horizontal
│  [Pedidos] [Resumen Ventas]        │
└─────────────────────────────────────┘
```

### 2.1 Secciones del Dashboard

| Sección             | Componente                   | Prioridad | Estado                            |
| ------------------- | ---------------------------- | --------- | --------------------------------- |
| Header              | Título inline (fecha + link) | Alta      | ✅ Actual                         |
| Indicadores del día | `ResumenCards`               | Media     | ✅ Actual (compacto, condicional) |
| Accesos Rápidos     | `AccesosDirectos`            | Alta      | ✅ Actual                         |
| Gestiones           | `AccesoReportes`             | Alta      | ✅ Actual                         |
| Reportes            | `AccesoReportesNuevo`        | Alta      | ✅ Actual                         |

---

## 3. Secciones en Detalle

### 3.1 Header — "Resumen de Hoy"

```
Resumen de Hoy
lunes, 07 de junio
```

| Elemento | Descripción                                     |
| -------- | ----------------------------------------------- |
| Título   | "Resumen de Hoy" con fontWeight 700             |
| Fecha    | dayjs locale 'es', formato "dddd, DD [de] MMMM" |
| Link     | "Consultar Todos" → navega a `/movimientos`     |

### 3.2 Indicadores del Día — `ResumenCards`

```
[VENTAS  ] [PAGOS   ]
[ $5.000 ] [ $2.000 ]
[INGRESOS] [RETIROS ]
[ $1.000 ] [   $0   ]
```

- Grid **2 columnas** para que todos los indicadores sean visibles sin scroll
- Números grandes (26px) para mejor legibilidad
- **Se muestran siempre los 4 tipos** aunque estén en $0
- Mismo color por tipo que los accesos rápidos (Venta=azul, Pago=naranja, Ingreso=verde, Retiro=gris)
- Cada card con borde izquierdo de 5px del color del tipo

### 3.3 Accesos Rápidos — `AccesosDirectos`

```
[💰 Venta] [📦 Pago] [📋 Cobro]
Scroll horizontal, snap align
```

- 3 botones táctiles con ícono, color distintivo y label
- Cada uno navega a `/pos/anotalo` con pre-selección de tipo
- Scroll horizontal sin scrollbar visible
- Sombra y bordes redondeados

### 3.4 Gestiones — `AccesoReportes`

```
┌──────────────────────────────────────┐
│  GESTIONES                           │
│                                      │
│  ┌──────┐ ┌──────┐ ┌────────┐      │
│  │ Caja  │ │ Cta  │ │Compras │      │
│  │       │ │ Cte  │ │        │      │
│  └──────┘ └──────┘ └────────┘      │
└──────────────────────────────────────┘
```

| Gestión       | Ruta               | Descripción                                                                       |
| ------------- | ------------------ | --------------------------------------------------------------------------------- |
| Caja          | `/reportes/caja`   | Administración de movimientos en efectivo: registro de ingresos y egresos de caja |
| Cta Corriente | `/reportes/ctacte` | Saldo de cuenta corriente por cliente/proveedor                                   |
| Compras       | `/compras`         | Gestión de compras y órdenes de compra                                            |

### 3.5 Reportes — `AccesoReportesNuevo`

```
┌──────────────────────────────────────────┐
│  REPORTES                                │
│                                          │
│  ┌──────────┐ ┌──────────────┐          │
│  │Movimientos│ │Saldo Ctas   │          │
│  │           │ │Ctes         │          │
│  └──────────┘ └──────────────┘          │
│  ┌──────────┐ ┌──────────────┐          │
│  │ Pedidos   │ │Resumen      │          │
│  │           │ │Ventas       │          │
│  └──────────┘ └──────────────┘          │
└──────────────────────────────────────────┘
```

| Reporte         | Ruta                        | Estado    | Descripción                                               |
| --------------- | --------------------------- | --------- | --------------------------------------------------------- |
| Movimientos     | `/movimientos`              | ✅ Actual | Listado completo de movimientos registrados               |
| Saldo Ctas Ctes | `/reportes/saldo-ctas-ctes` | 🔵 Futuro | Reporte de cuentas corrientes según alertas y condiciones |
| Pedidos         | `/pedidos`                  | 🔵 Futuro | Pedidos a proveedores, valores y pendientes de pago       |
| Resumen Ventas  | `/reportes/resumen-ventas`  | 🔵 Futuro | Desglose de ventas por periodo y rubro                    |

### 3.6 Gestión de Entidades

El acceso a la gestión de entidades (clientes/proveedores) se realiza desde:

- **BottomNav**: "Nóminas"
- **Sidebar**: "Clientes" y "Proveedores"
- Dashboard: ya no se incluye grid de gestión, se centraliza en la navegación inferior.

---

## 4. Flujo de Datos

```
DashboardPage
  ├── cargarResumenDelDia() → movimientoService.getAll()
  │     └── filtra por fecha de hoy
  │     └── acumula totales por tipo: { Venta: 5000, Pago: 2000, ... }
  │     └── solo tipos con importe > 0 se pasan a ResumenCards
  │
  ├── ResumenCards(totales) → renderiza cards solo para tipos con amount > 0
  │
  ├── AccesoReportes → navega a rutas de gestión
  │
  └── Eventos: storage, local-db-update, focus
        └── Recarga datos al detectar cambios
```

---

## 5. Mobile-First

### 5.1 Comportamiento responsive

| Elemento        | Mobile (< 768px)            | Desktop (>= 768px)          |
| --------------- | --------------------------- | --------------------------- |
| Layout          | Padding 16px, full width    | Padding 24px, max-width 50% |
| Indicadores     | Cards 50% tamaño, grid 2x2  | Cards 50% tamaño, grid 2x2  |
| Accesos Rápidos | Scroll horizontal, 75px min | Grid wrap, más grande       |
| Gestiones       | Scroll horizontal           | Grid 3 columnas             |
| Reportes        | Scroll horizontal           | Grid 4 columnas             |

### 5.2 Touch targets

- Todos los botones y cards deben tener área táctil mínima de 44x44px
- Scroll horizontal con `scroll-snap-type: x mandatory`
- Sin hover states que dependan de mouse (usar active state)

---

## 6. Roadmap

| Fase   | Feature                                                          | Estado                                      |
| ------ | ---------------------------------------------------------------- | ------------------------------------------- |
| Fase 1 | ResumenCards compactos (50%, condicional)                        | ✅ Actual                                   |
| Fase 2 | AccesosDirectos a POS                                            | ✅ Actual                                   |
| Fase 3 | Gestiones (Caja, Cta Cte, Compras)                               | ✅ Actual                                   |
| Fase 4 | Reportes (Movimientos, Saldo Ctas Ctes, Pedidos, Resumen Ventas) | ✅ Actual (Movimientos) / 🔵 Futuro (resto) |
| Fase 5 | Indicadores visuales (gráficos sparkline)                        | 🔵 Futuro                                   |
| Fase 6 | Personalización de secciones visibles                            | 🔵 Futuro                                   |

---

## 7. Archivos involucrados

| Archivo                                                  | Rol                                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/pages/Home.jsx`                                     | Wrapper simple que renderiza DashboardPage                                |
| `src/pages/Dashboard/DashboardPage.jsx`                  | Orquestador del dashboard (totales + eventos)                             |
| `src/pages/Dashboard/components/ResumenCards.jsx`        | Cards compactas (50%, condicional)                                        |
| `src/pages/Dashboard/components/AccesosDirectos.jsx`     | Acceso rápido a POS                                                       |
| `src/pages/Dashboard/components/AccesoReportes.jsx`      | Acceso a gestiones (Caja, Cta Cte, Compras)                               |
| `src/pages/Dashboard/components/AccesoReportesNuevo.jsx` | Acceso a reportes (Movimientos, Saldo Ctas Ctes, Pedidos, Resumen Ventas) |
| `src/pages/Compras/ComprasPage.jsx`                      | Módulo de compras                                                         |
| `src/pages/Pedidos/PedidosPage.jsx`                      | Módulo de pedidos (futuro)                                                |
| `src/pages/Reportes/SaldoCtasCtes/SaldoCtasCtesPage.jsx` | Reporte Saldo Ctas Ctes (futuro)                                          |
| `src/pages/Reportes/ResumenVentas/ResumenVentasPage.jsx` | Reporte Resumen Ventas (futuro)                                           |
| `src/router/AppRouter.jsx`                               | Rutas del dashboard y módulos                                             |
