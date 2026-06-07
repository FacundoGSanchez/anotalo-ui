# SDD - Módulo Entidades (Nóminas)

## Especificación de Administración de Clientes y Proveedores

**Versión:** 0.2
**Fecha:** 07/06/2026
**Propósito:** Definir la arquitectura del módulo de entidades (clientes/proveedores), su estado actual y hoja de ruta de mejoras.

---

## 1. Estado Actual (v0.1)

### 1.1 Estructura de navegación

```
BottomNav / Sidebar / Dashboard
  └── /entidades               → Selector de tipo (Clientes | Proveedores)
        └── /entidades/clientes  → Listado de clientes activos
              ├── /entidades/clientes/nuevo   → Formulario de alta
              └── /entidades/clientes/edit/:id → Formulario de edición
        └── /entidades/proveedores → Listado de proveedores activos
              ├── /entidades/proveedores/nuevo   → Formulario de alta
              └── /entidades/proveedores/edit/:id → Formulario de edición
```

### 1.2 Componentes

| Componente | Archivo | Función |
|------------|---------|---------|
| `EntidadesPage` | `pages/Entidades/EntidadesPage.jsx` | Orquestador: selector de tipo o listado o detalle |
| `SelectorEntidad` | (inline en EntidadesPage) | Dos paneles (Clientes/Proveedores) para elegir tipo |
| `EntidadesListado` | `pages/Entidades/components/EntidadesListado.jsx` | Tabla con búsqueda de entidades activas |
| `EntidadDetalleContainer` | `pages/Entidades/components/EntidadDetalle/EntidadDetalleContainer.jsx` | Contenedor alta/edición |
| `EntidadForm` | `pages/Entidades/components/EntidadDetalle/components/EntidadForm.jsx` | Formulario (nombre, teléfono) |
| `EntidadHeader` | `pages/Entidades/components/EntidadDetalle/components/EntidadHeader.jsx` | Header con volver y título |

### 1.3 Datos almacenados

```
db_clientes / db_proveedores (localStorage)
  └── { id, nro, nombre, telefono, activo }
```

- `entidadService` provee CRUD básico con soft-delete
- Sin datos financieros ni de cuenta corriente

### 1.4 Limitaciones actuales

- Solo datos básicos (nombre, teléfono)
- Sin cuenta corriente
- Sin condiciones comerciales
- Sin historial de operaciones por entidad
- Sin vista de detalle de entidad (solo edición inline)

---

## 2. Arquitectura Propuesta (v0.2)

### 2.1 Vista Principal de Entidad

```
/entidades/:tipo/:id → Vista detalle de la entidad
```

```
┌─────────────────────────────────────┐
│  ← Volver                           │
│                                     │
│  ┌─── Card: Datos de Entidad ─────┐ │
│  │  [Avatar]  Nombre              │ │
│  │            Código #123         │ │
│  │            Tel: 123456789      │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─── Card: Saldo Cta Cte ────────┐ │
│  │  Saldo: $ 25.000               │ │
│  │  [Ver movimientos →]           │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─── Acciones ───────────────────┐ │
│  │  [📝 Editar datos]             │ │
│  │  [💰 Registrar pago]          │ │  ← Solo si tiene Cta Cte
│  │  [📋 Ver movimientos]         │ │
│  │  [⚙️ Condiciones comerciales]  │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 2.2 Acciones según tipo de entidad

| Acción | Clientes | Proveedores |
|--------|----------|-------------|
| Editar datos | ✅ | ✅ |
| Registrar pago | ✅ (cobra) | ✅ (paga) |
| Ver movimientos | ✅ | ✅ |
| Condiciones comerciales | ✅ (plazos, límite crédito) | ✅ (plazos, forma de pago) |
| Consultar saldo Cta Cte | ✅ | ✅ |
| Estado de cuenta | ✅ | ✅ |

### 2.3 Cuenta Corriente

Cada entidad tendrá un registro de cuenta corriente:

```json
{
  "idEntidad": 1,
  "tipo": "clientes",
  "saldo": 25000,
  "movimientos": [
    { "fecha": "2026-06-01", "concepto": "Venta", "debe": 50000, "haber": 0, "saldo": 50000 },
    { "fecha": "2026-06-05", "concepto": "Pago", "debe": 0, "haber": 25000, "saldo": 25000 }
  ]
}
```

### 2.4 Condiciones Comerciales

```json
{
  "condicionIva": "Responsable Inscripto",
  "cuit": "20-12345678-9",
  "domicilio": "Calle Falsa 123",
  "plazoPago": 30,
  "limiteCredito": 100000,
  "listaPrecio": "Lista 1",
  "formaPago": "Transferencia"
}
```

### 2.5 Nuevos componentes propuestos

| Componente | Archivo | Función |
|------------|---------|---------|
| `EntidadView` | `components/EntidadView.jsx` | Vista detalle de entidad con datos y saldo |
| `EntidadCtaCte` | `components/EntidadCtaCte.jsx` | Saldo y movimientos de cuenta corriente |
| `EntidadAcciones` | `components/EntidadAcciones.jsx` | Botones de acción contextuales |
| `EntidadCondiciones` | `components/EntidadCondiciones.jsx` | Condiciones comerciales (IVA, CUIT, plazos) |
| `ctaCteService` | `services/ctaCteService.js` | Servicio de cuenta corriente |
| `condicionesService` | `services/condicionesService.js` | Servicio de condiciones comerciales |

### 2.6 Esquema de rutas propuesto

```
/entidades                              → Selector de tipo
/entidades/:tipo                        → Listado
/entidades/:tipo/:id                    → Vista detalle entidad
/entidades/:tipo/:id/editar             → Editar entidad
/entidades/:tipo/:id/ctacte             → Movimientos cuenta corriente
/entidades/:tipo/:id/condiciones        → Condiciones comerciales
/entidades/:tipo/nuevo                  → Nueva entidad
```

---

## 3. Flujo de Datos Propuesto

```
EntidadesPage
  ├── SelectorEntidad → setTipo → EntidadesListado
  ├── EntidadesListado → tap item → EntidadView(:id)
  │     ├── entidadService.getById(tipo, id)
  │     ├── ctaCteService.getSaldo(tipo, id)
  │     └── condicionesService.get(tipo, id)
  │
  ├── EntidadView
  │     ├── Card datos entidad
  │     ├── Card saldo Cta Cte → link a movimientos
  │     └── Card acciones
  │           ├── Editar → navigate(/entidades/:tipo/edit/:id)
  │           ├── Registrar pago → navigate(/pos/anotalo, {state})
  │           ├── Ver movimientos → /entidades/:tipo/:id/ctacte
  │           └── Condiciones → /entidades/:tipo/:id/condiciones
  │
  └── EntidadCtaCte
        └── Tabla movimientos con saldo parcial
```

---

## 4. Roadmap

| Fase | Feature | Estado |
|------|---------|--------|
| Fase 1 | CRUD básico (nombre, teléfono) | ✅ Actual |
| Fase 2 | Selector Clientes/Proveedores en /entidades | ✅ Actual |
| Fase 3 | Vista detalle de entidad con datos | 🔵 Pendiente |
| Fase 4 | Cuenta corriente (saldo + movimientos) | 🔵 Pendiente |
| Fase 5 | Condiciones comerciales (IVA, CUIT, plazos) | 🔵 Pendiente |
| Fase 6 | Acciones contextuales por tipo de entidad | 🔵 Pendiente |
| Fase 7 | Estado de cuenta descargable | 🔵 Futuro |

---

## 5. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/Entidades/EntidadesPage.jsx` | Orquestador del módulo |
| `src/pages/Entidades/components/EntidadesListado.jsx` | Listado con búsqueda |
| `src/pages/Entidades/components/EntidadDetalle/EntidadDetalleContainer.jsx` | Alta/edición |
| `src/pages/Entidades/components/EntidadDetalle/components/EntidadForm.jsx` | Formulario |
| `src/pages/Entidades/components/EntidadDetalle/components/EntidadHeader.jsx` | Header |
| `src/services/entidadService.js` | CRUD entidades |
| `src/router/AppRouter.jsx` | Rutas del módulo |
| `src/layout/BottomNav/BottomNav.jsx` | Acceso "Nóminas" |
| `src/data/MenuItems.jsx` | Menú sidebar |
| `src/pages/Dashboard/components/GestionGrid.jsx` | Acceso rápido dashboard |
