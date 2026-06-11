# SDD - Layout

## Especificación de Layout, Menú y Modo First-Mobile

**Versión:** 0.2
**Fecha:** 11/06/2026
**Propósito:** Definir la arquitectura del layout principal, el sistema de menú navegación y la estrategia first-mobile para una experiencia responsive óptima.

---

## 1. Estructura del Layout

```
┌─────────────────────────────────────┐
│  AppHeader (fijo, z-index 10)       │
│  ┌──────────┬──────────────────────┐ │
│  │ (botón)  │  [PWA install] [Avatar] │
│  └──────────┴──────────────────────┘ │
├──────────┬──────────────────────────┤
│ Sidebar  │ Content (Outlet)         │
│ (220px)  │                          │
│ dark     │  ← Página actual         │
│ colaps.  │                          │
│          │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

### 1.1 Componentes del Layout

| Componente | Archivo | Responsabilidad |
|------------|---------|-----------------|
| `MainLayout` | `src/layout/MainLayout.jsx` | Orquestador: Sidebar/Header (desktop) o BottomNav (mobile) + Outlet |
| `Sidebar` | `src/layout/Sidebar/Sidebar.jsx` | Sider colapsable con logo + menú (solo desktop) |
| `AppHeader` | `src/layout/Header/AppHeader.jsx` | Header responsivo con navegación (solo desktop) |
| `BottomNav` | `src/layout/BottomNav/BottomNav.jsx` | Barra inferior fija con 5 íconos (solo mobile) |
| `CardUser` | `src/layout/CardUser/CardUser.jsx` | Avatar + datos usuario + logout |
| `MoreMenuPage` | `src/pages/MoreMenu/MoreMenuPage.jsx` | Página con opciones agrupadas por módulo (ruta `/more`) |
| `FormasPagoConfigPage` | `src/pages/FormasPagoConfig/FormasPagoConfigPage.jsx` | Configuración de formas de pago con propiedades por org (ruta `/more/formas-pago`) |
| `MenuList` | `src/components/MenuList.jsx` | Renderiza el menú desde datos configurables |
| `MenuItems` | `src/data/MenuItems.jsx` | Datos de los ítems del menú |

---

## 2. Estrategia First-Mobile

### 2.1 Principios

1. **Mobile first**: El diseño base es para móviles; desktop es una mejora progresiva.
2. **Sidebar oculto en mobile**: Por debajo de 768px, el sidebar no se renderiza (`MainLayout.jsx:28`).
3. **Header oculto en mobile**: AppHeader solo se renderiza en desktop. En mobile la navegación principal es vía BottomNav.
4. **BottomNav en mobile**: Barra inferior fija con 5 accesos directos (Inicio, POS, Movimientos, Nóminas, Más).
5. **Breakpoint único**: 768px define el límite mobile/desktop (`DeviceContext.jsx`).
6. **Colapso automático**: El Sider de Ant Design colapsa automáticamente en breakpoint `md` (~768px) (`Sidebar.jsx:16`).

### 2.2 DeviceContext

```js
// src/context/DeviceContext.jsx
{
  isMobile: boolean,   // window.innerWidth < 768
  isDesktop: boolean   // window.innerWidth >= 768
}
```

- Se inicializa con el valor real al cargar (no hardcodeado a `false`)
- Escucha evento `resize` del window
- Se consume via `useDevice()` hook

### 2.3 Comportamiento por dispositivo

| Elemento | Mobile (< 768px) | Desktop (>= 768px) |
|----------|-----------------|-------------------|
| Sidebar | ❌ No se renderiza | ✅ Visible, colapsable (220px → 0) |
| Header | ❌ Oculto (maximiza espacio vertical) | ✅ Header completo con hamburguesa |
| BottomNav | ✅ Barra inferior fija (64px) | ❌ No se renderiza |
| Navegación | BottomNav: Inicio, POS, Movimientos, Nóminas, Más | Sidebar con menú completo |
| Más (BottomNav) | Ruta `/more` → `MoreMenuPage` con módulos agrupados | — |
| CardUser | Solo desde BottomNav → "Más" | Header derecho |
| PWA Install | Solo desde BottomNav → "Más" (futuro) | Header derecho |
| Contenido | `padding-bottom: 80px` para evitar solape | Sin padding extra |
| POSAnotalo | Layout centrado, max-width 480px | Layout centrado, max-width 480px |
| Dashboard | Scroll horizontal en tarjetas | Grid normal |

### 2.4 Bottom Navigation para mobile ✅ Implementado

Reemplaza el sidebar por una barra inferior de navegación fija en mobile:

```
┌──────────────────────────────┐
│                              │
│        Content (Outlet)      │
│                              │
├──────────────────────────────┤
│  🏠  │  🏪  │  📋  │  👥  │  ⋯  │  ← BottomNav
└──────────────────────────────┘
```

**Implementación actual** (`src/layout/BottomNav/BottomNav.jsx`):

| Item | Label | Ruta | Comportamiento |
|------|-------|------|----------------|
| 🏠 | Inicio | `/` | Links al dashboard |
| 🏪 | POS | `/pos/anotalo` | Links al wizard POS |
| 📋 | Movimientos | `/movimientos` | Links al listado |
| 👥 | Nóminas | `/entidades/clientes` | Links a clientes |
| ⋯ | Más | null | Abre `NavMenuModal` con módulos agrupados |

La opción "Más" navega a la ruta `/more` que renderiza `MoreMenuPage` (`src/pages/MoreMenu/MoreMenuPage.jsx`), una página con opciones organizadas por módulo:

| Módulo | Opciones |
|--------|----------|
| PRINCIPAL | Inicio |
| OPERACIONES | POS Anotalo, Movimientos |
| ENTIDADES | Clientes, Proveedores |
| REPORTES | Caja, Cta Corriente, Saldo Ctas Ctes, Resumen Ventas |
| COMPRAS | Compras, Pedidos |

**Características**:
- Barra fija de 64px en la parte inferior
- `z-index: 1000` para estar sobre el contenido
- Item activo se resalta con color `#1890ff`
- Compatible con `safe-area-inset-bottom` para dispositivos con notch
- Scroll horizontal del contenido tiene `padding-bottom: 80px` vía media query para evitar solape
- AppHeader oculto en mobile para maximizar espacio vertical

---

## 3. Sistema de Menú

### 3.1 Estructura de datos (`MenuItems.jsx`)

```js
MenuItem = {
  key: string,            // Ruta o clave única
  icon: ReactNode,        // Icono del menú
  label: string,          // Texto visible
  disabled?: boolean,     // Deshabilitado (visible pero no clickeable)
  children?: MenuItem[],  // Submenús
  meta?: {
    collapseOnClick?: boolean,  // Cerrar sidebar al clickear
    route?: {                   // Rutas diferenciadas
      mobile: string,
      desktop: string
    },
    requiredPermission?: string // (FUTURO) Permiso requerido para ver el item
  }
}
```

### 3.2 Items actuales

| Key | Label | Icon | Estado |
|-----|-------|------|--------|
| `/` | Inicio | HomeOutlined | ✅ Activo |
| `/pos` | POS Anotalo | ShopOutlined | ✅ Activo (collapseOnClick) |
| `/entidades/clientes` | Clientes | UsergroupAddOutlined | ✅ Activo |
| `/entidades/proveedores` | Proveedores | DeliveredProcedureOutlined | ✅ Activo |
| `/movimientos` | Movimientos | UnorderedListOutlined | ✅ Activo |
| `/reportes/caja` | Caja | BankOutlined | ✅ Activo |
| `/reportes/ctacte` | Cta Corriente | FileTextOutlined | ✅ Activo |
| `/reportes/saldo-ctas-ctes` | Saldo Ctas Ctes | AccountBookOutlined | ✅ Activo (placeholder) |
| `/reportes/resumen-ventas` | Resumen Ventas | BarChartOutlined | ✅ Activo (placeholder) |
| `/compras` | Compras | ShoppingCartOutlined | ✅ Activo (placeholder) |
| `/pedidos` | Pedidos | DeliveredProcedureOutlined | ✅ Activo (placeholder) |

### 3.3 MenuList — Comportamiento

```js
MenuList({ darkTheme, setCollapsed })
```

- Renderiza `<Menu>` de Ant Design con los items
- `onClick`:
  1. Busca el item clickeado recursivamente
  2. Si está `disabled`, no hace nada
  3. Resuelve la ruta: `item.meta.route[isMobile ? "mobile" : "desktop"] || item.key`
  4. Navega con `navigate(route)`
  5. Si es mobile o `item.meta.collapseOnClick`, cierra el sidebar

### 3.4 Filtrado por permisos (FUTURO)

```js
// En MenuList, filtrar items según permisos del usuario
const filterByPermission = (items, session) => {
  return items
    .filter(item => !item.meta?.requiredPermission || hasPermission(session, item.meta.requiredPermission))
    .map(item => ({
      ...item,
      children: item.children ? filterByPermission(item.children, session) : undefined
    }));
};
```

### 3.5 Mejoras futuras del menú

- [ ] Agregar `requiredPermission` a cada item para filtrado por rol
- [ ] Soportar items con `disabled` + tooltip explicativo ("Próximamente")
- [ ] Agregar indicador de badge/notificación en items
- [ ] Menú colapsable con íconos solamente en desktop (collapsedWidth=80 en lugar de 0)

---

## 4. Responsive Design

### 4.1 Breakpoints actuales

| Breakpoint | Valor | Uso |
|------------|-------|-----|
| Mobile | < 768px | Sidebar oculto, Header adaptativo |
| Desktop | >= 768px | Sidebar visible, menú completo |

### 4.2 Breakpoints futuros (Ant Design)

```js
// Media queries de Ant Design disponibles
{
  xs: '480px',
  sm: '576px',
  md: '768px',    // ← actual
  lg: '992px',
  xl: '1200px',
  xxl: '1600px'
}
```

### 4.3 Estrategias responsive por página

| Página | Mobile | Desktop |
|--------|--------|---------|
| Dashboard | 1 columna, scroll horizontal | Grid 2-3 columnas |
| POS | POSAnotaloMobile (wizard 5 pasos, max 480px) | POSAnotaloDesktop (layout completo, en desarrollo) |
| Movimientos | Lista simple, modal full screen | Tabla paginada |
| Entidades | Lista + modal/drawer | Split view o modal |

---

## 5. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/layout/MainLayout.jsx` | Orquestador del layout (condiciona Sidebar/Header vs BottomNav) |
| `src/layout/index.css` | Estilos del layout principal + media query mobile |
| `src/layout/Sidebar/Sidebar.jsx` | Barra lateral colapsable (solo desktop) |
| `src/layout/Sidebar/index.css` | Estilos del sidebar |
| `src/layout/Header/AppHeader.jsx` | Encabezado responsivo (solo desktop) |
| `src/layout/Header/index.css` | Estilos del header |
| `src/layout/BottomNav/BottomNav.jsx` | ✅ Barra inferior fija con 5 accesos (solo mobile) |
| `src/layout/BottomNav/index.css` | ✅ Estilos del BottomNav y modal "Más" |
| `src/pages/MoreMenu/MoreMenuPage.jsx` | ✅ Página con opciones agrupadas por módulo |
| `src/layout/CardUser/CardUser.jsx` | Avatar con logout (desktop: header / mobile: modal Más) |
| `src/layout/CardUser/index.css` | Estilos del card user |
| `src/components/MenuList.jsx` | Renderizador de menú |
| `src/data/MenuItems.jsx` | Datos del menú (sidebar desktop) |
| `src/data/spec_Menu.jsx` | Datos del menú (página "Más" mobile) |
| `src/context/DeviceContext.jsx` | Contexto de dispositivo |
