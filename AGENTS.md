# AGENTS.md — anotalo-ui

## Stack
- React 18 + Vite 6 (JSX, **no TypeScript**)
- Ant Design 5, React Router 6, react-icons, dayjs
- ESLint 9 flat config (`eslint.config.js`), `react-refresh` plugin
- PWA via `vite-plugin-pwa` (prompt-based SW update)

## Dev commands
```sh
npm run dev       # Vite dev server
npm run build     # Vite build → dist/
npm run preview   # Vite preview of built app
npm run lint      # ESLint on all files
```
No test or typecheck commands exist.

## Key architecture

### Data layer
Fully client-side — all data persisted to **localStorage** (no real backend in this repo). Key store keys:
- `movimientos_db` — transaction history
- `db_clientes`, `db_proveedores` — entity registries
- `cierres_db` — cash closure records
- `auth_token`, `auth_user` — session
- `org_config_<orgId>` — per-org config (formas de pago, rubros)
- `current_org_id`, `current_sucursal_id` — active org/branch

Services in `src/services/` wrap localStorage CRUD + dispatch `CustomEvent("local-db-update")` for cross-tab sync.

### Auth & permissions
- Mock auth via `authService`: hardcoded user `admin` / password `adminanotalo`
- Real backend via `VITE_API_URL` env var — if set, login calls `POST /api/auth/login`
- Role-based permission check: `can(modulo, formulario, accion="leer")` exposed from `useAuth()`
- Route guards: `ProtectedRoute` (auth) + `PermissionRoute` (role) in `AppRouter.jsx`

### Routing
- `BrowserRouter` in `main.jsx` with React Router v6.4+ future flags (`v7_startTransition`, `v7_relativeSplatPath`)
- SPA fallback: `_redirects` + `netlify.toml` (`/* → /index.html 200`)
- All routes documented in `sdd/spec_Routing.md`

### Timezone & locale
- Hardcoded to `America/Argentina/Buenos_Aires` (see `useArgentineDate` hook)
- Number formatting uses `es-AR` locale (`formatFloat.js`)
- All date arithmetic is Argentina-local, **not UTC**

### Responsive
- `DeviceContext` sets `isMobile` at 768px breakpoint
- Desktop: sidebar + header; Mobile: bottom nav + top bar
- CSS hides `ant-layout-sider` / `.sidebar` below 768px (`src/index.css`)

### PWA updates
- `UpdatePrompt` component watches SW updates via `useRegisterSW` (`virtual:pwa-register/react`)
- Shows antd `notification` with "Actualizar ahora" button when new version detected

## Conventions
- No TypeScript — all files `.js` / `.jsx`
- Component exports: named functions, default export at bottom
- Services are plain objects with methods, not classes
- Custom events: `"local-db-update"`, `"org-changed"`, `"sucursal-changed"` — listen for reactive updates
- Entidad soft-delete via `activo: false` flag, never hard-deleted
- Only `Venta` and `Pago` movimiento types allow entity editing

## Backend reference
Actual backend SQL scripts in `backend/scripts/` (SQL Server). Integration specs in `backend/it/`. Not part of the UI build — reference only.

## SDDs
Feature specs in `sdd/` (Spanish) — consult when adding/refactoring features, especially `spec_Routing.md` (permissions model) and `spec_PosAnotalo*.md`.
