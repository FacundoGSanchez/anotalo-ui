# SDD - Software Design Document

## Anotalo UI — Análisis Técnico Inicial

**Versión:** 0.1  
**Fecha:** 05/06/2026  
**Propósito:** Documentar la arquitectura, stack tecnológico y estructura del proyecto para evaluar su estado actual y planificar evoluciones.

---

## 1. Resumen del Proyecto

Aplicación PWA de punto de venta (POS) y gestión de caja, completamente offline-first. Almacena todos los datos en `localStorage` sin backend ni API REST. Orientada a dispositivos móviles con soporte progresivo para desktop.

### 1.1 Objetivo de Experiencia de Usuario

El enfoque principal de la aplicación es la **UX ágil, intuitiva y accesible** para cualquier usuario, priorizando a dueños y empleados de pequeños comercios que no poseen conocimiento profundo en gestión administrativa, procedimientos contables ni uso de aplicaciones de gestión empresarial. Cada interacción debe sentirse natural, predecible y sin fricción, minimizando la curva de aprendizaje.

---

## 2. Stack Tecnológico

| Capa                 | Tecnología                           | Versión |
| -------------------- | ------------------------------------ | ------- |
| Framework UI         | React                                | ^18.3.1 |
| Build tool           | Vite                                 | ^6.3.5  |
| Router               | React Router DOM                     | ^6.30.1 |
| Componentes          | Ant Design                           | ^5.26.3 |
| Iconos (principales) | react-icons (Material Design)        | ^5.5.0  |
| Iconos (menú)        | @ant-design/icons                    | ^6.1.0  |
| Fechas               | dayjs (no declarado en package.json) | —       |
| Lenguaje             | JavaScript (JSX) — sin TypeScript    | —       |
| PWA                  | vite-plugin-pwa                      | ^1.2.0  |
| Linter               | ESLint (flat config v9)              | ^9.25.0 |

### Dependencias faltantes detectadas

- ~~`dayjs` se usa en múltiples componentes pero **no está declarado** en `package.json` (probablemente resuelto como dependencia transitiva de antd).~~ ✅ Agregado como dependencia directa en `package.json` (v1.11.13).

---

## 3. Estructura del Proyecto

```
anotalo-ui/
├── index.html                   # Entry point HTML (SPA, PWA meta tags)
├── vite.config.js               # Configuración Vite + PWA plugin
├── eslint.config.js             # ESLint flat config
├── netlify.toml                 # Deploy config (Netlify)
├── _redirects                   # SPA redirect rule
├── package.json
├── public/
│   ├── images/                  # Logo, iconos PWA, avatar
│   └── vite.svg
└── src/
    ├── main.jsx                 # Mount point + BrowserRouter
    ├── App.jsx                  # Componente raíz
    ├── index.css                # Estilos globales + overrides Ant Design
    ├── router/
    │   └── AppRouter.jsx        # Definición de rutas con auth guard
    ├── context/
    │   ├── AuthContext.jsx      # Estado de autenticación (localStorage)
    │   └── DeviceContext.jsx    # Detección mobile/desktop
    ├── hooks/
    │   ├── useArgentineDate.js  # Timezone Argentina (Intl)
    │   ├── usePWAInstall.js     # Captura evento beforeinstallprompt
    │   └── ... (hooks por feature)
    ├── layout/
    │   ├── MainLayout.jsx      # Shell: Sidebar + Header + Outlet
    │   ├── Sidebar/            # Menú colapsable con logo
    │   ├── Header/             # Header responsive con hamburger
    │   └── CardUser/           # Avatar + logout
    ├── components/             # Componentes compartidos
    │   ├── MenuList.jsx
    │   ├── SelectSingleModal.jsx
    │   ├── UpdatePrompt.jsx    # Notificación actualización PWA
    │   └── formatFloat.js
    ├── constants/
    │   └── posConstants.jsx    # Constantes: tipos, colores, formas de pago
    ├── data/
    │   └── MenuItems.jsx       # Definición de items del menú navegación
    └── pages/                  # Módulos por funcionalidad
        ├── auth/               # LoginPage
        ├── Dashboard/          # Home con resumen, accesos directos, gestión
        ├── POSAnotalo/         # POS con dos versiones según dispositivo (mobile/desktop)
        │   ├── POSAnotalo.jsx  # Router: elige mobile o desktop según DeviceContext
        │   ├── POSAnotaloMobile.jsx  # Versión mobile-first (wizard 5 pasos)
        │   ├── POSAnotaloDesktop.jsx # Versión desktop (en desarrollo)
        │   ├── components/steps/  # Componentes por paso (compartidos)
        │   ├── hooks/usePosFlow.js  # Lógica de navegación del wizard
        │   └── data/posMocks.js    # Mock data para desarrollo
        ├── Movimientos/        # Listado paginado, filtros, detalle modal
        └── Entidades/          # CRUD clientes/proveedores (lista + formulario)
```

---

## 4. Arquitectura de Componentes

### 4.1 Patrón Modular por Feature

Cada feature se organiza como:

```
pages/{Feature}/
├── {Feature}Page.jsx       # Orquestador / Container
├── components/              # Componentes específicos del feature
│   ├── {SubComponente}.jsx
│   └── {SubFeature}/
│       └── components/
└── hooks/                   # Hooks específicos (opcional)
└── data/                    # Mock data (opcional)
└── services/                # Servicios (opcional)
```

### 4.2 Patrones identificados

| Patrón                     | Ejemplo                               | Descripción                                                         |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| Container/Presentational   | EntidadDetalleContainer + EntidadForm | El container maneja estado/lógica, el presentacional solo renderiza |
| Orquestador multi-vista    | EntidadesPage                         | Usa useParams() para decidir entre lista y formulario               |
| Wizard multi-paso          | POSAnotalo + usePosFlow               | Pasos controlados por estado, navegación centralizada en hook       |
| Datos como config          | MenuList + MenuItems                  | Items del menú definidos como datos, no como JSX                    |
| Modales autocontenidos     | ModalFiltros, ModalDetalleMovimiento  | Props: open, onClose, onSelect                                      |
| Hooks de lógica compartida | useAuth, useDevice, usePosFlow        | Logica extraída de componentes                                      |

---

## 5. Enrutamiento

```
<BrowserRouter>
  <Routes>
    /login                        → LoginPage (redirige a / si auth)
    <MainLayout> (protegido por ProtectedRoute → useAuth())
      /                           → DashboardPage
      /pos/anotalo                → POSAnotalo (wizard 5 pasos)
      /movimientos                → MovimientosPage
      /entidades/:tipo            → EntidadesPage (lista)
      /entidades/:tipo/:action    → EntidadesPage (nuevo/editar)
      /entidades/:tipo/:action/:id → EntidadesPage (editar específico)
      /more                       → MoreMenuPage
      /more/formas-pago           → FormasPagoConfigPage
      /reportes/ctacte            → ReporteCtaCte
      /reportes/ctacte/:tipo/:id  → DetalleCtaCtePage
    *                             → Redirige a / o /login
```

Future flags activadas: `v7_startTransition`, `v7_relativeSplatPath`.

---

## 6. Persistencia y Estado

### 6.1 Capas de Estado

| Capa             | Mecanismo                           | Ámbito           |
| ---------------- | ----------------------------------- | ---------------- |
| Autenticación    | React Context + localStorage        | Global           |
| Dispositivo      | React Context + window.innerWidth   | Global           |
| Wizard POS       | Custom Hook (usePosFlow) + useState | Local al feature |
| Datos de negocio | localStorage directo                | Global           |

### 6.2 Esquema localStorage

```
movimientos_db: [{ id, tipo, importe, formaPago, entidad: { id, nombre, nro }, fecha, usuario }]
db_clientes:    [{ id, nro, nombre, activo, fechaAlta }]
db_proveedores: [{ id, nro, nombre, activo, fechaAlta }]
user:          { username, name, role }
```

### 6.3 Sincronización entre tabs

`movimientoService.save()` dispara:

1. `storage` event (navegador, captura cambios de otras pestañas)
2. Custom `local-db-update` event (captura cambios dentro de la misma pestaña)

Componentes se suscriben via `useEffect`.

---

## 7. Flujo de Datos

```
Acción Usuario → Componente → movimientoService.save()
  → localStorage.setItem()
  → dispatchEvent('local-db-update')
  → Otros componentes (useEffect) re-leen localStorage
  → UI actualizada
```

No hay llamadas HTTP ni API externa. Toda la lógica de negocio es client-side.

> **Nota de migración futura**: Cuando se conecte a la API .NET, solo será necesario reemplazar la implementación interna de cada servicio (manteniendo la misma interfaz pública). Ningún componente necesita modificarse porque todos dependen de la abstracción del servicio, no de `localStorage` directamente.

---

## 8. Servicios

Se aplicó patrón Repository para abstraer el acceso a datos. Todos los componentes consumen datos a través de estos servicios, nunca directamente desde `localStorage`.

### movimientoService (`src/services/movimientoService.js`)

| Método                                     | Descripción                                             |
| ------------------------------------------ | ------------------------------------------------------- |
| `getAll()`                                 | Retorna todos los movimientos                           |
| `getByDate(fecha)`                         | Retorna movimientos filtrados por fecha                 |
| `save(movimiento, user)`                   | Crea un nuevo movimiento y notifica cambios vía eventos |
| `update(id, data)`                         | Actualiza un movimiento por ID                          |
| `deleteById(id)`                           | Elimina un movimiento por ID                            |
| `getLeyendaInformativa(movimiento, tipos)` | Retorna texto informativo según tipo y forma de pago    |

### entidadService (`src/services/entidadService.js`)

| Método                     | Descripción                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| `getAll(tipo)`             | Retorna todas las entidades de un tipo (`clientes`/`proveedores`) |
| `getActivos(tipo)`         | Retorna solo entidades activas                                    |
| `getById(tipo, id)`        | Retorna una entidad por ID                                        |
| `create(tipo, values)`     | Crea una nueva entidad con número correlativo                     |
| `update(tipo, id, values)` | Actualiza una entidad                                             |
| `softDelete(tipo, id)`     | Marca entidad como inactiva (borrado lógico)                      |

### Estado de migración

| Servicio        | Archivo                                              | Estado          |
| --------------- | ---------------------------------------------------- | --------------- |
| Movimientos     | `src/services/movimientoService.js`                  | ✅ Implementado |
| Entidades       | `src/services/entidadService.js`                     | ✅ Creado       |
| Placeholder POS | `src/pages/POSAnotalo/services/movimientoService.js` | ❌ Eliminado    |

---

## 9. Observaciones Técnicas

### 9.1 Fortalezas

- Arquitectura modular por feature, facilita escalado y aislamiento
- Offline-first: funcionamiento completo sin conexión
- PWA con service worker y manifest para instalación mobile
- Sincronización entre tabs vía eventos del navegador
- Timezone Argentina correctamente manejado con `Intl.DateTimeFormat`
- Responsive design con sidebar colapsable en mobile

### 9.2 Debilidades / Deuda Técnica

- **Sin TypeScript**: `@types/react` instalados pero no usados
- **Sin tests**: No hay framework ni archivos de test
- **Sin HTTP client**: No hay axios ni fetch API — imposible conectar con backend
- **dayjs no declarado** en package.json (dependencia huérfana)
- **Mock auth**: Credenciales hardcodeadas (`MOCK_USER`/`MOCK_PASS`)
- **IDs por timestamp**: `Date.now()` como ID — riesgo de colisión en concurrencia
- **Duplicación de estilos**: inline styles + CSS files coexisten sin convención clara
- **Sin manejo de errores centralizado**: errores de localStorage no se capturan

### 9.3 Riesgos

- Escalabilidad: localStorage tiene límite de ~5-10 MB
- Migración futura a backend requerirá refactor completo del servicio de datos
- Sin tests, cualquier cambio debe verificarse manualmente
- Sin types, refactors son propensos a errores runtime

---

## 10. Recomendaciones Iniciales

| Prioridad   | Acción                                                | Impacto                                                              |
| ----------- | ----------------------------------------------------- | -------------------------------------------------------------------- |
| Prioridad   | Acción                                                | Impacto                                                              |
| ----------- | --------                                              | ---------                                                            |
| 🔴 Alta     | Migrar a TypeScript                                   | Prevención de errores, autocompletado                                |
| 🔴 Alta     | Agregar testing framework (Vitest)                    | Calidad, refactors seguros                                           |
| ✅ Hecho    | Declarar dayjs en package.json (v1.11.13)              | Consistencia de dependencias                                         |
| 🟡 Media    | Definir convención de estilos (CSS modules vs inline) | Consistencia                                                         |
| ✅ Hecho    | Abstraer servicios de datos (Repository pattern)      | `movimientoService` extendido + `entidadService` creado              |
| ✅ Hecho    | Eliminar service placeholder vacío                    | `POSAnotalo/services/movimientoService.js` eliminado                 |
| 🔵 Futuro   | Implementar backend API + capa HTTP (axios/fetch)     | Reemplazar implementación de servicios manteniendo la misma interfaz |
