# SDD - Autenticación

## Especificación de Autenticación, Servicio y Objetivos

**Versión:** 0.1
**Fecha:** 07/06/2026
**Propósito:** Definir la arquitectura de autenticación, el contrato del servicio, los componentes de UI y el roadmap evolutivo hacia un sistema multi-rol con API real.

---

## 1. Objetivos de Autenticación

| Prioridad | Objetivo                                                         | Estado                 |
| --------- | ---------------------------------------------------------------- | ---------------------- |
| 🔴 Alta   | Validar identidad del usuario al ingresar                        | ✅ Implementado (mock) |
| 🔴 Alta   | Persistir sesión entre recargas (localStorage)                   | ✅ Implementado        |
| 🔴 Alta   | Proteger rutas privadas contra acceso anónimo                    | ✅ Implementado        |
| 🟡 Media  | Cerrar sesión (limpiar estado + storage + redirigir)             | ✅ Implementado        |
| 🟡 Media  | Diferenciar roles de usuario (ADMIN_ROOT, ADMIN, OPERADOR, etc.) | ⬜ Pendiente           |
| 🟡 Media  | Filtrar menú y rutas según rol                                   | ⬜ Pendiente           |
| 🟡 Media  | Integrar con API .NET real (auth + JWT)                          | ⬜ Pendiente           |
| 🔵 Futuro | Refresh token automático                                         | ⬜ Pendiente           |
| 🔵 Futuro | Recuperación de contraseña                                       | ⬜ Pendiente           |
| 🔵 Futuro | Registro de cuenta                                               | ⬜ Pendiente           |
| 🔵 Futuro | Multi-sesión (organización + sucursal activa)                    | ⬜ Pendiente           |

---

## 2. Arquitectura Actual

```
LoginPage (UI)
  ↓ login(username, password)
AuthContext (Estado global)
  ↓ llama
authService (Capa de datos)
  ↓ localStorage    |    ↓ fetch (si VITE_API_URL definida)
Mock local          |    API .NET real
```

### 2.1 Capas

| Capa        | Archivo                            | Responsabilidad                                                                                             |
| ----------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| UI (Login)  | `src/pages/auth/LoginPage.jsx`     | Formulario, validación visual, llamada a `login()`                                                          |
| Contexto    | `src/context/AuthContext.jsx`      | Estado global (`user`, `session`, `isAuthenticated`, `loading`), expone `login()`, `logout()`, `getToken()` |
| Servicio    | `src/services/authService.js`      | Abstracción de persistencia: mock local o fetch a API                                                       |
| UI (Logout) | `src/layout/CardUser/CardUser.jsx` | Avatar + Popover con datos de usuario y botón de cierre                                                     |

### 2.2 Estado de AuthContext

```js
{
  user: { id, username, nombre, mail, rol },
  session: { usuario, token, organizaciones[], sucursales[], roles[], sessionId },
  isAuthenticated: boolean,
  loading: boolean
}
```

### 2.3 Contrato del Servicio (`authService`)

```js
authService = {
  login(username, password)        → Promise<session>
  logout()                         → void
  getToken()                       → string | null
  getSession()                     → session | null
  isAuthenticated()                → boolean
  getAuthHeaders()                 → { Authorization: "Bearer <token>" }
}
```

### 2.4 Modo Mock (actual)

- Usa credenciales hardcodeadas: `admin` / `adminanotalo`
- Retorna `MOCK_RESPONSE` con usuario, token, organizaciones, sucursales, roles
- Simula latencia de 800ms
- Se activa cuando `VITE_API_URL` no está definida

### 2.5 Modo API Real

- Se activa cuando `VITE_API_URL` está definida en `.env`
- Endpoint: `POST {API_BASE}/api/auth/login`
- Body: `{ username, password }`
- Response esperada: `{ usuario, token, organizaciones[], sucursales[], roles[] }`
- Token se persiste en `localStorage` como `auth_token`
- Sesión completa como `auth_user`

---

## 3. LoginPage — Especificación UI

### 3.1 Estados visuales

| Estado          | Comportamiento                                                                                |
| --------------- | --------------------------------------------------------------------------------------------- |
| **Inicial**     | Formulario con valores mock precargados. Logo centrado. Placeholder "Usuario" y "Contraseña". |
| **Cargando**    | Botón "Ingresar" muestra spinner. Campos deshabilitados.                                      |
| **Error**       | `message.error()` con texto del error (credenciales incorrectas, error de red, etc.)          |
| **Redirección** | Al éxito, navega a `/` mediante `navigate("/")`                                               |

### 3.2 Elementos del formulario

| Elemento                  | Tipo           | Reglas                                                   |
| ------------------------- | -------------- | -------------------------------------------------------- |
| Usuario                   | Input          | `required`, placeholder "Usuario"                        |
| Contraseña                | Input.Password | `required`, placeholder "Contraseña", toggle visibilidad |
| ¿Olvidaste tu contraseña? | Link           | `disabled` por ahora                                     |
| Ingresar                  | Button primary | `htmlType submit`, `loading` mientras auth               |
| Crear Cuenta              | Button link    | `disabled` por ahora, ubicado en Footer                  |

### 3.3 Diseño responsive

- Mobile: formulario ocupa ~90% del ancho, sin scroll horizontal
- Desktop: centrado vertical y horizontal, max-width ~400px
- Footer con diagonal decorativa (CSS existente)

### 3.4 Mejoras futuras

- [ ] Reemplazar valores mock hardcodeados por placeholders genéricos
- [ ] Agregar botón "Ver contraseña" con indicador visual más claro
- [ ] Mostrar selector de organización/sucursal si el usuario tiene múltiples
- [ ] Agregar validación de formato de email si se usa email en lugar de username

---

## 4. Manejo de Roles y Permisos

### 4.1 Roles definidos en backend (SQL)

Según `022_DDLTabla_Roles.sql`, `023_DDLTabla_Permisos.sql`, `024_DDLTabla_RolPermiso.sql`:

| Tabla        | Propósito                                                            |
| ------------ | -------------------------------------------------------------------- |
| `Roles`      | Define los roles del sistema (ADMIN_ROOT, ADMIN, OPERADOR, etc.)     |
| `Permisos`   | Define códigos de permiso (ej: `MOV_VER`, `MOV_CREAR`, `ENT_EDITAR`) |
| `RolPermiso` | Asignación muchos-a-muchos entre roles y permisos                    |

### 4.2 Modelo de permisos propuesto para frontend

```js
// Mapa de permisos por módulo
const PERMISOS = {
  DASHBOARD: { VER: "DASH_VER" },
  MOVIMIENTOS: {
    VER: "MOV_VER",
    CREAR: "MOV_CREAR",
    EDITAR: "MOV_EDITAR",
    ELIMINAR: "MOV_ELIMINAR",
  },
  ENTIDADES: {
    VER: "ENT_VER",
    CREAR: "ENT_CREAR",
    EDITAR: "ENT_EDITAR",
    ELIMINAR: "ENT_ELIMINAR",
  },
  POS: { USAR: "POS_USAR" },
  USUARIOS: { VER: "USR_VER", CREAR: "USR_CREAR", EDITAR: "USR_EDITAR" },
  REPORTES: { VER: "REP_VER" },
};
```

### 4.3 Integración con AuthContext

```js
// En el objeto session (desde authService):
session = {
  usuario: { ... },
  token: "...",
  organizaciones: [...],
  sucursales: [...],
  roles: ["ADMIN_ROOT"],
  permisos: ["DASH_VER", "MOV_VER", "MOV_CREAR", "ENT_VER", "ENT_CREAR", "POS_USAR"]
}
```

### 4.4 Helper de permisos

Crear `src/utils/permissions.js`:

```js
export const hasPermission = (session, permiso) => {
  if (!session?.permisos) return false;
  if (session.roles?.includes("ADMIN_ROOT")) return true; // Admin todo-poderoso
  return session.permisos.includes(permiso);
};
```

---

## 5. Flujo de Sesión Completo

```
Inicio de App
  ↓
AuthProvider monta → useEffect: authService.getSession()
  ↓
  ├── Sesión existente y válida → restaura user + session + isAuthenticated = true
  └── Sesión inexistente/expirada → isAuthenticated = false, loading = false
        ↓
  ProtectedRoute evalúa:
  ├── loading = true → muestra "Cargando..."
  ├── isAuthenticated = false → <Navigate to="/login">
  └── isAuthenticated = true → renderiza children
```

---

## 6. Roadmap de Evolución

| Fase                | Feature                    | Detalle                                                              |
| ------------------- | -------------------------- | -------------------------------------------------------------------- |
| **Fase 1** (Actual) | Mock auth                  | Credenciales hardcodeadas, sesión localStorage, sin roles reales     |
| **Fase 2**          | API real + JWT             | Consumir `POST /api/auth/login`, validar token, manejar errores HTTP |
| **Fase 3**          | Roles y permisos           | Cargar permisos desde API, filtrar menú y rutas por rol              |
| **Fase 4**          | Multi-sesión               | Selector de organización/sucursal activa, contexto de sesión activa  |
| **Fase 5**          | Token refresh              | Interceptor de fetch/axios para refresh automático                   |
| **Fase 6**          | Recuperación de contraseña | Flujo de reset con email                                             |
| **Fase 7**          | Registro de cuenta         | Formulario de registro con validación                                |

---

## 7. Archivos involucrados

| Archivo                               | Rol                            |
| ------------------------------------- | ------------------------------ |
| `src/pages/auth/LoginPage.jsx`        | Página de login                |
| `src/pages/auth/components/Logo.jsx`  | Componente logo                |
| `src/pages/auth/components/style.css` | Estilos de login               |
| `src/context/AuthContext.jsx`         | Estado global de auth          |
| `src/services/authService.js`         | Servicio de autenticación      |
| `src/layout/CardUser/CardUser.jsx`    | Avatar + logout                |
| `src/router/AppRouter.jsx`            | ProtectedRoute                 |
| `src/utils/permissions.js`            | **(NUEVO)** Helper de permisos |
