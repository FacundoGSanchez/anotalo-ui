# SDD - Configuraciones

## Especificación del Módulo de Configuración por Organización

**Versión:** 0.2
**Fecha:** 13/06/2026
**Propósito:** Definir las pantallas de configuración de la organización, accesibles desde el menú principal en la sección CONFIGURACIONES.

---

## 0. Persistencia

Todas las configuraciones se almacenan en `localStorage` bajo la clave `org_config_{orgId}` y se administran via `orgService`.

---

## 1. ConfigPOS

### Ruta: `/configuraciones/pos`
### Componente: `ConfigPosPage.jsx`

Página de flags booleanos que controlan el comportamiento del módulo POS.

| Flag | Default | Descripción |
|------|---------|-------------|
| `usaRubro` | true | Si `true`, `StepImporte` muestra botones de selección de rubro. Si `false`, muestra un único botón "AGREGAR" que añade el item sin rubro |

### Estructura

```
┌─────────────────────────────────────────────┐
│  ← Configuración POS                        │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  USAR RUBROS EN POS                     ││
│  │  [Toggle]                               ││
│  │  Activa la selección de rubro al        ││
│  │  agregar items en el POS                ││
│  └─────────────────────────────────────────┘│
│                                             │
└─────────────────────────────────────────────┘
```

---

## 2. Rubros

### Ruta: `/configuraciones/rubros`
### Componente: `RubrosConfigPage.jsx`

CRUD de rubros que se muestran en `StepImporte` al agregar items.

### Modelo

```js
{
  id: number,
  sigla: string,    // 1-3 caracteres (V, K, B, F, P...)
  nombre: string,   // Nombre visible (Varios, Kiosco...)
  grupo: string,    // Agrupación (General, Alimentos...)
}
```

### Estructura

```
┌─────────────────────────────────────────────┐
│  ← Rubros                          [↻] [+] │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  V   Varios          General        [›] ││
│  │  K   Kiosco          Alimentos      [›] ││
│  │  B   Bebidas         Alimentos      [›] ││
│  └─────────────────────────────────────────┘│
│                                             │
└─────────────────────────────────────────────┘
```

### Acciones

- **Agregar**: botón `[+]` en header → modal con campos sigla, nombre, grupo
- **Editar**: botón `[›]` en registro → modal precargado con mismos campos
- **Eliminar**: dentro del modal de edición, botón "Eliminar rubro" con confirmación Popconfirm
- **Restaurar**: botón `[↻]` en header → restaura lista a RUBROS_DEFAULT

---

## 3. Formas de Pago

### Ruta: `/configuraciones/formas-pago`
### Componente: `FormasPagoConfigPage.jsx`

CRUD de formas de pago disponibles para el tipo Venta en el POS.

### Modelo

```js
{
  id: number,
  nombre: string,             // Efectivo, Tarjeta...
  sigla: string,              // Efe, Tar, Cta...
  requiereEntidad: boolean,   // requiere seleccionar cliente
  impactaCaja: boolean,       // impacta en saldo de caja física
  impactaCtaCte: boolean,     // impacta en cuenta corriente
}
```

### Estructura

```
┌─────────────────────────────────────────────┐
│  ← Formas de Pago                  [↻] [+] │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────────┐│
│  │  Efectivo  Efe                      [›] ││
│  │  [requiereEntidad] [impactaCaja] [CtaCte]│
│  ├─────────────────────────────────────────┤│
│  │  Cta Cte   Cta                      [›] ││
│  │  [requiereEntidad] [impactaCaja] [CtaCte]│
│  └─────────────────────────────────────────┘│
│                                             │
└─────────────────────────────────────────────┘
```

### Acciones

- **Agregar**: botón `[+]` en header → modal con campos nombre, sigla y toggles
- **Editar**: botón `[›]` en registro → modal precargado
- **Eliminar**: dentro del modal de edición, botón "Eliminar forma de pago" con confirmación Popconfirm
- **Restaurar**: botón `[↻]` en header → restaura lista a FORMAS_PAGO_DEFAULT
- **Toggles directos** en la lista para `requiereEntidad`, `impactaCaja`, `impactaCtaCte`

---

## 4. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/Configuraciones/ConfigPosPage.jsx` | Configuración de flags del POS |
| `src/pages/Configuraciones/RubrosConfigPage.jsx` | CRUD de rubros |
| `src/pages/Configuraciones/FormasPagoConfigPage.jsx` | CRUD de formas de pago |
| `src/services/orgService.js` | Helpers de persistencia |
| `src/constants/posConstants.jsx` | Constantes (RUBROS_DEFAULT, FORMAS_PAGO) |
| `src/data/MenuItems.jsx` | Menú (grupo CONFIGURACIONES) |
| `src/router/AppRouter.jsx` | Rutas `/configuraciones/*` |
| `sdd/spec_config.md` | Esta especificación |
