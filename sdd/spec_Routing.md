# SDD - Routing

## Especificación de Enrutamiento y Guardias por Permiso

**Versión:** 0.2
**Fecha:** 13/06/2026
**Propósito:** Documentar la arquitectura de enrutamiento, el sistema de protección de rutas y el modelo de permisos basado en módulos/formularios.

---

## 1. Estructura de Rutas Actual

```
<BrowserRouter>                         (main.jsx)
└── <AuthProvider>                       (AuthContext)
    └── <Routes>                         (AppRouter.jsx)
        ├── /login                      → LoginPage
        │   (si autenticado, redirige a /)
        │
        ├── <ProtectedRoute>             (usa useAuth())
        │   └── <MainLayout>             (Sidebar + Header + Outlet)
        │       ├── /                           → Home
        │       ├── /pos/anotalo                → POSAnotalo (wizard)
        │       ├── /movimientos                → MovimientosPage
        │       ├── /entidades/:tipo[/:action[/:id]] → EntidadesPage
        │       ├── /more                       → MoreMenuPage
        │       ├── /gestiones/ctacte[/:tipo/:id] → AdminCtaCtePage / DetalleCtaCtePage
        │       ├── /gestiones/caja             → AdminCajaPage
        │       ├── /compras                    → AdminComprasPage
        │       ├── /pedidos                    → PedidosPage
        │       ├── /reportes/saldo-ctas-ctes   → SaldoCtasCtesPage
        │       ├── /reportes/resumen-ventas    → ResumenVentasPage
        │       │
        │       └── <PermissionRoute>           (protección por permiso)
        │           └── /configuraciones/*
        │               ├── /pos                → ConfigPosPage
        │               ├── /rubros             → RubrosConfigPage
        │               └── /formas-pago        → FormasPagoConfigPage
        │
        └── *                                  → redirige a / o /login
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

## 3. Sistema de Permisos

### 3.1 Modelo de datos

```
Rol ──N:N── Permiso ──N:1── Modulo
 │                          
 │                          
 └──N:N── Usuario           
```

Cada permiso vincula un `rol` con un `{ modulo, formulario, acciones }`:

```js
// Rol
{ id: number, nombre: string }

// Permiso
{ modulo: string, formulario: string, acciones: string[] }

// Módulos definidos
DASHBOARD | POS | MOVIMIENTOS | ENTIDADES | GESTIONES | REPORTES | CONFIG

// Acciones estándar
leer | crear | editar | eliminar

// Comodines
modulo: "*"    → todos los módulos
formulario: "*" → todos los formularios del módulo
acciones: ["*"] → todas las acciones
```

### 3.2 Implementación

**AuthContext expone `can(modulo, formulario, accion = "leer")`:**

```js
// Busca los roles del usuario en session.rolesData
// Recorre permisos buscando match exacto (o "*" comodín)
can("CONFIG", "rubros", "editar")  // → true/false
can("POS", "venta")                // → true/false (accion default: "leer")
```

**PermissionRoute en AppRouter:**

```jsx
const PermissionRoute = ({ modulo, formulario, accion, children }) => {
  if (!can(modulo, formulario, accion)) return <Navigate to="/" replace />;
  return children;
};

// Uso:
<Route path="configuraciones/pos" element={
  <PermissionRoute modulo="CONFIG" formulario="pos">
    <ConfigPosPage />
  </PermissionRoute>
} />
```

### 3.3 Roles por defecto

| Rol | Acceso |
|-----|--------|
| `ADMIN_ROOT` (id:1) | Full: `{ "*": { "*": ["*"] } }` |
| `CAJERO` (id:2) | POS completo, Movimientos (leer), Caja (full), Entidades (leer) |
| `GERENTE` (id:3) | Lectura global + POS completo + Config full + Reportes full |
| `ADMIN` (id:4) | Full: `{ "*": { "*": ["*"] } }` |

### 3.4 Rutas protegidas actuales

| Ruta | Módulo | Formulario | Acción |
|------|--------|------------|--------|
| `/configuraciones/pos` | CONFIG | pos | leer |
| `/configuraciones/rubros` | CONFIG | rubros | leer |
| `/configuraciones/formas-pago` | CONFIG | formas-pago | leer |

> **Nota:** Las rutas CRUD de org, sucursales, roles y usuarios se gestionan en otro sistema (backoffice). Esta app solo mockea el objeto que viene del auth con toda la información del usuario y sus configuraciones.

### 3.5 Flujo de verificación

```
Usuario autenticado → session.rolesData + user.roles
         │
         ▼
  can(modulo, formulario, accion)
         │
         ├── user.roles = [1, 4]  (IDs de rol)
         ├── filtra rolesData
         ├── collecta permisos
         └── match: modulo ∧ formulario ∧ (accion en acciones)
                ├── true  → renderiza
                └── false → Navigate to "/"
```
