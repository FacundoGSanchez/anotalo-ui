# SDD - Routing

## Especificación de Enrutamiento, Guardias y Permisos por Rol

**Versión:** 0.1
**Fecha:** 07/06/2026
**Propósito:** Documentar la arquitectura de enrutamiento, el sistema de protección de rutas y el diseño para implementar permisos basados en roles de usuario.

---

## 1. Estructura de Rutas Actual

```
<BrowserRouter>                         (main.jsx)
└── <Routes>                            (AppRouter.jsx)
    ├── /login                          → LoginPage
    │   (si autenticado, redirige a /)
    │
    ├── <ProtectedRoute>                (usa useAuth())
    │   └── <MainLayout>                (Sidebar + Header + Outlet)
    │       ├── /                       → DashboardPage (Home)
    │       ├── /pos/anotalo            → POSAnotalo (wizard)
    │       ├── /movimientos            → MovimientosPage
    │       ├── /entidades/:tipo        → EntidadesPage (lista)
    │       ├── /entidades/:tipo/:action    → EntidadesPage (nuevo/editar)
    │       └── /entidades/:tipo/:action/:id → EntidadesPage (editar específico)
    │
    └── *                               → redirige a / o /login
```

---

## 2. Guardias de Ruta

### 2.1 ProtectedRoute (actual)

```js
const ProtectedRoute = ({ children }) => {
  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};
```

**Comportamiento:**

| Estado | Acción |
|--------|--------|
| `loading = true` | Muestra "Cargando..." (prevenir flash de login) |
| `isAuthenticated = false` | `<Navigate to="/login" replace />` |
| `isAuthenticated = true` | Renderiza `<MainLayout>` con `<Outlet>` |

### 2.2 Redirección de /login

```js
element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
```

- Si el usuario ya está autenticado e intenta ir a `/login`, se redirige al home.
- Si no está autenticado, se muestra la página de login.

### 2.3 Catch-all (*)

```js
<Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
```

- Atrapa cualquier ruta no definida.
- Redirige según el estado de autenticación.

---

## 3. Sistema de Permisos por Rol

### 3.1 Arquitectura propuesta

```
AppRouter.jsx
  └── RoleGuard (nuevo componente)
        ├── Verifica permisos del usuario vs ruta solicitada
        ├── Si no tiene permiso → redirige a "/" o a página "No Autorizado"
        └── Si tiene permiso → renderiza children
```

### 3.2 Mapa de rutas con permisos requeridos

```js
// src/router/routePermissions.js
const ROUTE_PERMISSIONS = {
  "/":                     null,               // Acceso público (autenticado)
  "/pos/anotalo":          "POS_USAR",
  "/movimientos":          "MOV_VER",
  "/entidades/clientes":   "ENT_VER",
  "/entidades/proveedores":"ENT_VER",
  "/usuarios":             "USR_VER",
};

export const getRequiredPermission = (pathname) => {
  // Coincidencia exacta primero
  if (ROUTE_PERMISSIONS[pathname]) return ROUTE_PERMISSIONS[pathname];

  // Coincidencia por patrón (ej: /entidades/clientes/nuevo)
  for (const [pattern, permiso] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(pattern)) return permiso;
  }
  return null; // ruta sin permiso requerido = acceso permitido si autenticado
};
```

### 3.3 Componente RoleGuard

```js
const RoleGuard = ({ children, requiredPermission }) => {
  const { session, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Si no requiere permiso específico, pasa
  if (!requiredPermission) return children;

  // Si el rol es ADMIN_ROOT, pasa (superadmin)
  if (session?.roles?.includes("ADMIN_ROOT")) return children;

  // Verificar permiso específico
  if (!session?.permisos?.includes(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
```

### 3.4 Integración en AppRouter

```js
<Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
  <Route index element={<RoleGuard requiredPermission="DASH_VER"><Home /></RoleGuard>} />
  <Route path="pos/anotalo" element={<RoleGuard requiredPermission="POS_USAR"><POSAnotalo /></RoleGuard>} />
  <Route path="movimientos" element={<RoleGuard requiredPermission="MOV_VER"><MovimientosPage /></RoleGuard>} />
  <Route path="entidades/:tipo" element={<RoleGuard requiredPermission="ENT_VER"><EntidadesPage /></RoleGuard>} />
  <Route path="entidades/:tipo/:action" element={<RoleGuard requiredPermission="ENT_CREAR"><EntidadesPage /></RoleGuard>} />
  <Route path="entidades/:tipo/:action/:id" element={<RoleGuard requiredPermission="ENT_EDITAR"><EntidadesPage /></RoleGuard>} />
</Route>
```

---

## 4. Permisos por Acción (CRUD)

Para rutas que implican acciones específicas, se puede usar un enfoque más granular:

```js
// src/router/routePermissions.js (extendido)
const ROUTE_PERMISSIONS = [
  { pattern: "/entidades/clientes", permission: "ENT_VER", exact: true },
  { pattern: "/entidades/proveedores", permission: "ENT_VER", exact: true },
  { pattern: "/entidades/clientes/nuevo", permission: "ENT_CREAR" },
  { pattern: "/entidades/proveedores/nuevo", permission: "ENT_CREAR" },
  { pattern: "/entidades/clientes/editar", permission: "ENT_EDITAR" },
  { pattern: "/entidades/proveedores/editar", permission: "ENT_EDITAR" },
];

export const resolvePermission = (pathname) => {
  // Coincidencia más específica primero
  const sorted = [...ROUTE_PERMISSIONS].sort((a, b) =>
    b.pattern.length - a.pattern.length
  );

  for (const rule of sorted) {
    if (rule.exact) {
      if (pathname === rule.pattern) return rule.permission;
    } else if (pathname.startsWith(rule.pattern)) {
      return rule.permission;
    }
  }
  return null;
};
```

---

## 5. Filtrado del Menú por Permisos

El menú debe ocultar/deshabilitar items según los permisos del usuario:

```js
// En MenuItems.jsx (futuro)
{
  key: "/movimientos",
  icon: <UnorderedListOutlined />,
  label: "Movimientos",
  disabled: false,
  meta: {
    requiredPermission: "MOV_VER"   // ← Filtro
  }
}
```

```js
// En MenuList.jsx (futuro)
const filteredItems = useMemo(() => {
  return MenuItems.filter(item => {
    const perm = item.meta?.requiredPermission;
    return !perm || hasPermission(session, perm);
  }).map(item => ({
    ...item,
    children: item.children?.filter(child => {
      const childPerm = child.meta?.requiredPermission;
      return !childPerm || hasPermission(session, childPerm);
    })
  }));
}, [session]);
```

---

## 6. Mapa de Rutas Futuras

| Ruta | Componente | Permiso | Prioridad |
|------|-----------|---------|-----------|
| `/login` | LoginPage | — | ✅ Actual |
| `/` | DashboardPage | `DASH_VER` | ✅ Actual |
| `/pos/anotalo` | POSAnotalo | `POS_USAR` | ✅ Actual |
| `/movimientos` | MovimientosPage | `MOV_VER` | ✅ Actual |
| `/movimientos/:id` | MovimientoDetalle | `MOV_VER` | 🔵 Futuro |
| `/entidades/clientes` | EntidadesPage (lista) | `ENT_VER` | ✅ Actual |
| `/entidades/proveedores` | EntidadesPage (lista) | `ENT_VER` | ✅ Actual |
| `/entidades/clientes/nuevo` | EntidadDetalleContainer | `ENT_CREAR` | ✅ Actual |
| `/entidades/proveedores/nuevo` | EntidadDetalleContainer | `ENT_CREAR` | ✅ Actual |
| `/entidades/:tipo/editar/:id` | EntidadDetalleContainer | `ENT_EDITAR` | ✅ Actual |
| `/usuarios` | UsuariosPage | `USR_VER` | 🔵 Futuro |
| `/usuarios/nuevo` | UsuarioForm | `USR_CREAR` | 🔵 Futuro |
| `/reportes` | ReportesPage | `REP_VER` | 🔵 Futuro |
| `/configuracion` | ConfigPage | `CFG_VER` | 🔵 Futuro |
| `/no-autorizado` | PaginaNoAutorizado | — | 🔵 Futuro |

---

## 7. Manejo de Rutas No Encontradas (404)

Implementar una página 404 personalizada:

```js
// src/pages/NotFound/NotFoundPage.jsx
const NotFoundPage = () => (
  <Result
    status="404"
    title="404"
    subTitle="La página que buscas no existe."
    extra={<Button type="primary" onClick={() => navigate("/")}>Volver al Inicio</Button>}
  />
);
```

```js
// En AppRouter.jsx
<Route path="*" element={<NotFoundPage />} />
```

---

## 8. Lazy Loading (Futuro)

Para mejorar el rendimiento en mobile, cargar rutas con `React.lazy`:

```js
import { lazy, Suspense } from "react";

const DashboardPage = lazy(() => import("../pages/Dashboard/DashboardPage"));
const POSAnotalo = lazy(() => import("../pages/POSAnotalo/POSAnotalo"));
const MovimientosPage = lazy(() => import("../pages/Movimientos/MovimientosPage"));
const EntidadesPage = lazy(() => import("../pages/Entidades/EntidadesPage"));
```

```js
<Suspense fallback={<div>Cargando...</div>}>
  <Route index element={<DashboardPage />} />
  {/* ... */}
</Suspense>
```

---

## 9. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/main.jsx` | BrowserRouter + AuthProvider + DeviceProvider |
| `src/router/AppRouter.jsx` | Definición de rutas + ProtectedRoute |
| `src/router/routePermissions.js` | **(NUEVO)** Mapa de rutas → permisos requeridos |
| `src/components/RoleGuard.jsx` | **(NUEVO)** Guardia de permisos por rol |
| `src/utils/permissions.js` | **(NUEVO)** Helper `hasPermission()` |
| `src/pages/NotFound/NotFoundPage.jsx` | **(NUEVO)** Página 404 |
| `src/data/MenuItems.jsx` | Datos del menú (con filtro de permisos futuro) |
| `src/components/MenuList.jsx` | Renderiza menú (con filtrado futuro) |
