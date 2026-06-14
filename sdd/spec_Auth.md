# SDD - Auth

## Especificación del Modelo de Autenticación y Sesión

**Versión:** 0.1
**Fecha:** 13/06/2026
**Propósito:** Documentar el flujo de autenticación, la estructura de la sesión y los modelos de datos de usuario, organización, sucursal y roles.

---

## 1. Flujo de Login

```
LoginPage
  │
  ├── usuario + contraseña → authService.login()
  │       │
  │       ├── POST /auth/login  (mock: user+pass = "admin")
  │       │
  │       └── Response (MOCK_RESPONSE almacenado en authService.js):
  │             {
  │               usuario: { id, username, mail, nombre, rol, roles },
  │               token: "mock-token",
  │               sessionId: "mock-session-id",
  │               organizaciones: [ { id, nombre, ... } ],
  │               sucursales: [ { id, organizacionId, nombre } ],
  │               rolesData: [ { id, nombre, permisos } ]
  │             }
  │
  ├── Guarda en localStorage:
  │     localStorage.setItem("auth_token", token)
  │     localStorage.setItem("auth_user", JSON.stringify(usuario))
  │
  └── Redirige a "/"

Logout
  ├── Limpia localStorage (auth_token, auth_user, current_org_id, current_sucursal_id)
  └── Redirige a /login
```

## 2. Modelos de Datos

### 2.1 Usuario

```js
{
  id: 1,
  username: "admin",
  mail: "admin@anotalo.com",
  nombre: "Administrador",
  rol: "Admin",                // display name
  roles: [1, 4]               // IDs de rol (permisos reales)
}
```

### 2.2 Organización

```js
{
  id: 1,
  nombre: "Anotalo Demo",
  sucursalDefault: 1,
  FormasPago: [ ... ],
  TiposMovimiento: [ ... ]
}
```

- Se selecciona automáticamente la primera org al login.
- El usuario puede cambiar de organización (`switchOrganizacion` en AuthContext).
- El ID de org activa se persiste en `localStorage` como `current_org_id`.
- Se usa `useCurrentOrg()` hook para obtener `{ orgId, organizacion }`.

### 2.3 Sucursal

```js
{
  id: 1,
  organizacionId: 1,
  nombre: "Casa Central"
}
```

- Se selecciona la `sucursalDefault` de la org activa al cambiar de org.
- El usuario puede cambiar de sucursal desde el Header.
- El ID de sucursal activa se persiste en `localStorage` como `current_sucursal_id`.
- Se usa `useCurrentSucursal()` hook para obtener `{ sucursalId, sucursal }`.

### 2.4 Rol

```js
{
  id: 1,
  nombre: "ADMIN_ROOT",
  permisos: [
    { modulo: "*", formulario: "*", acciones: ["*"] }
  ]
}
```

### 2.5 Permiso (dentro de un rol)

```js
{ modulo: string, formulario: string, acciones: string[] }

// Módulos:
MODULOS = { DASHBOARD, POS, MOVIMIENTOS, ENTIDADES, GESTIONES, REPORTES, CONFIG }

// Acciones:
ACCIONES = { LEER, CREAR, EDITAR, ELIMINAR }

// Comodines:
{ modulo: "*", formulario: "*", acciones: ["*"] }   → acceso total
```

## 3. Sesión (AuthContext)

**Estado global:**

```js
{
  session: {
    token,
    usuario,
    organizaciones,
    sucursales,
    rolesData,
    sessionId,
  } | null,
  isAuthenticated: boolean,
  loading: boolean,
  currentOrgId: number | null,
  currentSucursalId: number | null,
}
```

**Métodos expuestos:**

| Método | Descripción |
|--------|-------------|
| `login(username, password)` | Autentica y carga sesión |
| `logout()` | Limpia sesión y localStorage |
| `switchOrganizacion(orgId)` | Cambia org activa + sucursal default |
| `switchSucursal(sucursalId)` | Cambia sucursal activa |
| `can(modulo, formulario, accion = "leer")` | Verifica permiso granular |
| `isAdmin` | `true` si el usuario tiene rol full-access |

## 4. Hooks de acceso

### `useCurrentOrg()`

```js
const { orgId, organizacion, orgNombre } = useCurrentOrg();
```

### `useCurrentSucursal()`

```js
const { sucursalId, sucursal, sucursalNombre } = useCurrentSucursal();
```

## 5. Roles por defecto

| ID | Nombre | Acceso |
|----|--------|--------|
| 1 | `ADMIN_ROOT` | Full access a todo el sistema |
| 2 | `CAJERO` | POS, Movimientos (leer), Caja (full), Entidades (leer) |
| 3 | `GERENTE` | Lectura global + POS + Config + Reportes |
| 4 | `ADMIN` | Full access (igual que ADMIN_ROOT, nombre más simple) |

## 6. NOTA: CRUD externo

El mantenimiento (ABM) de las siguientes entidades se realiza desde **otro sistema backoffice**, no desde esta app:

- Organizaciones
- Sucursales
- Roles
- Usuarios

Esta app solo recibe y consume la información ya configurada.

## 7. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/contexts/AuthContext.jsx` | Provider global, estado de sesión, can(), switchOrg/Suc |
| `src/services/authService.js` | Mock de login (MOCK_RESPONSE), switchSucursal |
| `src/constants/permisos.js` | MODULOS, ACCIONES, ROLES |
| `src/constants/localStorage.js` | Keys de localStorage |
| `src/hooks/useCurrentOrg.js` | Hook para org activa |
| `src/hooks/useCurrentSucursal.js` | Hook para sucursal activa |
| `src/components/PermissionRoute.jsx` | Route guard por permiso |
