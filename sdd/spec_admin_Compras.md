# Módulo Gestión de Compras

## Estructura general

- Ruta única: `/compras` → `AdminComprasPage`
- Layout con 2 tabs: "Pagos" (default) y "Pedidos" (placeholder)
- Header con título "Gestión de Compras", icono `MdShoppingCart` y botón volver (`MdArrowBack`)
- Look & feel consistente con Admin Caja y Admin Cta Cte:
  - `maxWidth: 600px`, `margin: 0 auto`, `background: #f8f9fa`
  - Cards blancas `borderRadius: 16px`, `border: 1px solid #f0f0f0`
  - Tipografía: `Typography` de Ant Design

---

## Tab "Pagos" (funcional)

### Data layer

- Se reutiliza `movimientoService` con `tipo === "Pago"`
- Las formas de pago disponibles se obtienen de `orgService.getFormasPago(orgId, "Pago")`
- Los proveedores se obtienen de `entidadService.getActivos("proveedores")`
- Refresco reactivo vía evento `local-db-update`

### Listado de pagos

- **Origen**: `movimientoService.getAll().filter(m => m.tipo === "Pago")` ordenado por `fecha` descendente
- **Paginación**: 15 registros iniciales + botón "Ver más" que incrementa de a 15
- **Búsqueda**: `Input.Search` filtra por coincidencia en `entidad.nombre` (case-insensitive)
- **Cada fila** muestra:
  - Nombre del proveedor (`entidad.nombre`)
  - Fecha de pago (`fecha`)
  - Importe formateado en pesos argentinos (`es-AR`)
  - Botón `>` (MdChevronRight) para abrir modal de detalle

### Modal de detalle del pago

- Campos visibles (read-only):
  - Proveedor
  - Fecha de pago
  - Importe
  - Forma de pago
  - Observación
- Botón "Editar": permite modificar **importe** (teclado numérico) y **forma de pago** (grid selector)
  - Al guardar → `movimientoService.update(id, { importe, formaPago })`
  - Cierra modal y refresca listado
- Botón "Eliminar": `Popconfirm` → `movimientoService.deleteById(id)` → refresca

### Registro de pago — Wizard (3 pasos)

Modal que se abre desde botón "Registrar Pago" flotante/fijo.

**Paso 1: Seleccionar Proveedor**
- Lista de proveedores activos (`entidadService.getActivos("proveedores")`)
- Buscador interno por nombre
- Cada proveedor es un card clickeable
- Al seleccionar → guarda `entidad: { id, nombre }` en estado y avanza al paso 2

**Paso 2: Ingresar Importe**
- Mismo teclado numérico y visor que en Cta Cte (`DetalleCtaCtePage`)
- Layout: visor de importe arriba, teclado 3×4 abajo, botón "Continuar"
- Valida importe > 0
- Al continuar → avanza al paso 3

**Paso 3: Seleccionar Forma de Pago**
- Grid de formas de pago (mismo diseño que paso 2 de cobro en Cta Cte)
- Cada forma: card con icono + label, hover color con sombra
- Al seleccionar → llama a:
  ```js
  movimientoService.save({
    tipo: "Pago",
    importe: Number(importe),
    formaPago: fp.key,
    entidad: { id: proveedor.id, nombre: proveedor.nombre },
    observacion: "",
  }, user)
  ```
- Cierra modal, resetea estados, refresca listado
- Si la forma de pago tiene `impactaCaja: true`, el movimiento impacta en el saldo de caja

---

## Tab "Pedidos" (placeholder)

- Mismo estilo visual que placeholder actual
- Texto: "Gestión de pedidos a proveedores — próximamente"
- Icono `MdAssignment`

---

## Archivos involucrados

| Archivo | Acción |
|---------|--------|
| `src/pages/Gestiones/AdminCompras/AdminComprasPage.jsx` | Implementación completa ~500 líneas |
| `src/router/AppRouter.jsx` | Eliminar ruta `/pedidos` |
| `src/pages/Pedidos/PedidosPage.jsx` | Eliminar |
| `src/data/MenuItems.jsx` | Eliminar item `/pedidos` del grupo COMPRAS |

---

## No incluye (versión futura)

- Permisos (`PermissionRoute`) para el módulo
- Tab Pedidos funcional (planificación de pedidos a proveedores)
- Store/entidad específica de pedidos
