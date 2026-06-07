# SDD - Dashboard

## Especificación de Dashboard: Accesos Rápidos, Indicadores y Navegación Mobile-First

**Versión:** 0.1
**Fecha:** 07/06/2026
**Propósito:** Definir la arquitectura del dashboard como centro de comando de la aplicación, con enfoque mobile-first, accesos directos a funciones principales y punto de entrada a reportes.

---

## 1. Propósito del Dashboard

El dashboard es la pantalla principal post-login. Su objetivo es:

1. Proveer **acceso inmediato** a las operaciones más frecuentes (POS, entidades, movimientos)
2. Mostrar **indicadores de contexto** del día con cards compactas
3. Actuar como **hub de navegación** hacia reportes y módulos de gestión
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
│  [Venta] [Pago] [Ingreso] [Retiro] │  ← Scroll horizontal
├─────────────────────────────────────┤
│  REPORTES                           │
│  [Caja] [Cta Cte] [Mov. x Tipo]    │  ← Scroll horizontal
├─────────────────────────────────────┤
│  GESTIÓN                            │
│  [Clientes] [Proveed.] [Usuarios]   │  ← Grid 3 columnas
└─────────────────────────────────────┘
```

### 2.1 Secciones del Dashboard

| Sección | Componente | Prioridad | Estado |
|---------|-----------|-----------|--------|
| Header | Título inline (fecha + link) | Alta | ✅ Actual |
| Indicadores del día | `ResumenCards` | Media | ✅ Actual (compacto, condicional) |
| Accesos Rápidos | `AccesosDirectos` | Alta | ✅ Actual |
| Reportes | `AccesoReportes` | Alta | ✅ Actual |
| Gestión | `GestionGrid` | Media | ✅ Actual |

---

## 3. Secciones en Detalle

### 3.1 Header — "Resumen de Hoy"

```
Resumen de Hoy                        [Consultar Todos →]
lunes, 07 de junio
```

| Elemento | Descripción |
|----------|-------------|
| Título | "Resumen de Hoy" con fontWeight 700 |
| Fecha | dayjs locale 'es', formato "dddd, DD [de] MMMM" |
| Link | "Consultar Todos" → navega a `/movimientos` |

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
[💰 Venta] [📦 Pago] [➕ Ingreso] [🏦 Retiro]
Scroll horizontal, snap align
```

- 4 botones táctiles con ícono, color distintivo y label
- Cada uno navega a `/pos/anotalo` con `state.tipoDirecto` y `skipFirstStep: true`
- Scroll horizontal sin scrollbar visible
- Sombra y bordes redondeados

### 3.4 Reportes — `AccesoReportes`

```
┌──────────────────────────────────────┐
│  REPORTES                            │
│                                      │
│  ┌──────┐ ┌──────┐ ┌────────┐      │
│  │ Caja  │ │ Cta  │ │Movim.  │      │
│  │       │ │ Cte  │ │por Tipo│      │
│  └──────┘ └──────┘ └────────┘      │
└──────────────────────────────────────┘
```

| Reporte | Ruta | Descripción |
|---------|------|-------------|
| Caja | `/reportes/caja` | Arqueo de caja: saldo inicial, ingresos, egresos, saldo final |
| Cta Corriente | `/reportes/ctacte` | Saldo de cuenta corriente por cliente/proveedor |
| Movimientos | `/reportes/movimientos` | Resumen por tipo y forma de pago |

### 3.5 Gestión — `GestionGrid`

```
[Clientes] [Proveedores] [Usuarios*]
Grid 3 columnas, ícono + label
```

- 3 items en fila: Clientes, Proveedores (activos), Usuarios (disabled)
- Cada uno navega a `/entidades/{tipo}`
- Usuarios se mantiene deshabilitado hasta implementar el módulo

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
  ├── handleIrARegistro(tipo) → navigate("/pos/anotalo", { state })
  │
  └── Eventos: storage, local-db-update, focus
        └── Recarga datos al detectar cambios
```

---

## 5. Mobile-First

### 5.1 Comportamiento responsive

| Elemento | Mobile (< 768px) | Desktop (>= 768px) |
|----------|-----------------|-------------------|
| Layout | Padding 16px, full width | Padding 24px, max-width |
| Indicadores | Cards 50% tamaño, scroll horizontal | Cards 50% tamaño, scroll horizontal |
| Accesos Rápidos | Scroll horizontal, 75px min | Grid wrap, más grande |
| Reportes | Scroll horizontal | Grid 3 columnas |
| Gestión | Grid 3 columnas | Grid 3 columnas |

### 5.2 Touch targets

- Todos los botones y cards deben tener área táctil mínima de 44x44px
- Scroll horizontal con `scroll-snap-type: x mandatory`
- Sin hover states que dependan de mouse (usar active state)

---

## 6. Roadmap

| Fase | Feature | Estado |
|------|---------|--------|
| Fase 1 | ResumenCards compactos (50%, condicional) | ✅ Actual |
| Fase 2 | AccesosDirectos a POS | ✅ Actual |
| Fase 3 | Acceso a Reportes desde dashboard | ✅ Actual |
| Fase 4 | Indicadores visuales (gráficos sparkline) | 🔵 Futuro |
| Fase 5 | Personalización de secciones visibles | 🔵 Futuro |

---

## 7. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/Home.jsx` | Wrapper simple que renderiza DashboardPage |
| `src/pages/Dashboard/DashboardPage.jsx` | Orquestador del dashboard (totales + eventos) |
| `src/pages/Dashboard/components/ResumenCards.jsx` | ✅ Cards compactas (50%, condicional) |
| `src/pages/Dashboard/components/AccesosDirectos.jsx` | ✅ Acceso rápido a POS |
| `src/pages/Dashboard/components/AccesoReportes.jsx` | ✅ Acceso a reportes (Caja, Cta Cte, Mov. x Tipo) |
| `src/pages/Dashboard/components/GestionGrid.jsx` | ✅ Grid de gestión |
| `src/pages/Dashboard/components/GestionItem.jsx` | ✅ Item individual del grid |
