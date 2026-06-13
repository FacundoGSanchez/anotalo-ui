# SDD - POS Anotalo Mobile

## Especificación del Módulo POS — Versión Mobile (Wizard Táctil)

**Versión:** 0.3
**Fecha:** 13/06/2026
**Propósito:** Definir la arquitectura del módulo POS mobile. Actualmente solo opera con movimiento **Venta** (tipo fijo). Wizard táctil de 4 pasos optimizado para pantallas pequeñas, sin soporte de lectora de barras.

---

## 0. Vista General

`POSAnotaloMobile.jsx` se renderiza cuando `useDevice().isDesktop` es `false`. El tipo de movimiento está fijo en `"Venta"` — no hay paso de selección de tipo. `StepTipo.jsx` existe pero no se utiliza (código muerto).

---

## 1. Flujo del Wizard

```
IMPORTE → FORMA_PAGO → [ENTIDAD] → CONFIRMAR
   0          1             2          3
```

- **ENTIDAD se salta** si la forma de pago seleccionada no tiene `requiereEntidad: true` o si ya se cargó una entidad en un paso anterior.

### 1.1 Pasos

| Paso | Componente | Descripción |
|------|-----------|-------------|
| 0 - IMPORTE | `StepImporte.jsx` | Ingreso de múltiples items con importe + rubro vía calculadora táctil. Cada item se agrega a la lista con su rubro asociado. Se puede editar el rubro o eliminar el item. Se muestra el total acumulado |
| 1 - FORMA_PAGO | `StepFormaPago.jsx` | Selección de forma de pago (personalizable por org) |
| 2 - ENTIDAD | `StepEntidad.jsx` | Selección de cliente. Si la forma de pago no requiere entidad, se ofrece botón "Consumidor Final" como default. Si `requiereEntidad` es `true`, obliga a seleccionar un cliente |
| 3 - CONFIRMAR | `StepConfirmar.jsx` | Resumen y confirmación del registro |

### 1.2 Navegación

- `usePosFlow` hook maneja el estado del wizard
- `currentStep` se inicializa en `STEPS.IMPORTE` (índice 1, TIPO se salta)
- `handleNext(data)` avanza al siguiente paso acumulando datos; desde FORMA_PAGO salta ENTIDAD si no es necesaria
- `handleBack()` retrocede al paso anterior
- `closePos()` cierra/navega fuera del POS

---

## 2. Layout Mobile

### 2.1 Contenedor

```
┌─────────────────────────────────────┐
│  Contenido del paso (variable)      │
│  - Sin scroll vertical excesivo     │
│  - Botón de acción siempre visible  │
├─────────────────────────────────────┤
│  BottomNav (64px) — SOLO MOBILE     │
└─────────────────────────────────────┘
```

> `PosHeader.jsx` existe como componente pero actualmente no se utiliza en el flujo mobile.

### 2.2 Alturas máximas recomendadas

| Elemento | Altura |
|----------|--------|
| Card contenedor padding | 12px |
| Visor importe | 80px |
| Botones de acción | 44px |
| Cards de forma pago | ~72px |
| Step label (footer) | 16px |

> El contenido total debe ocupar menos del 100vh - 64px (BottomNav) para evitar scroll innecesario.

---

## 3. Paso Importe (multi-importe con rubro)

### 3.1 Flujo

1. El usuario ingresa un monto en el visor usando la calculadora táctil
2. Selecciona un **rubro** (Varios, Kiosco, Bebidas, Frutas/Verduras, Panadería) presionando uno de los botones rápidos o el botón **"+"** para ver todos los rubros agrupados por categoría
3. El item se agrega a la lista con `{ id, importe, rubro }` y el visor se resetea para seguir cargando
4. El visor se resetea a 0 para ingresar el próximo monto
5. Cada item se muestra en la lista del tab Resumen con su importe, nombre del rubro y botones de:
   - **Editar rubro** (✎) — abre el selector de rubros para cambiar el rubro del item
   - **Eliminar** (✕) — quita el item de la lista
6. El total acumulado se actualiza automáticamente
7. El usuario puede volver a **Calculadora** para seguir agregando items o presionar **"CONTINUAR"** desde el tab Resumen para enviar `{ importe: total, lineItems }` al hook `usePosFlow`

### 3.2 Tabs

El paso tiene dos tabs:
- **Calculadora** — visor + teclado numérico + botones de rubro
- **Resumen** — lista de items agregados con opciones de editar/eliminar y botón CONTINUAR

### 3.3 Validaciones

- No se permite agregar un monto de 0
- Cada item respeta el límite de `VISOR_CONFIG.MAX_DIGITOS` (12 dígitos)
- El botón CONTINUAR se deshabilita si no hay al menos 1 item en la lista
- Al navegar hacia atrás, los `lineItems` se restauran desde el estado del movimiento

---

## 4. Paso Entidad (solo Clientes)

Al ser un POS exclusivo de **Venta**, la entidad siempre es un **cliente**.

### 4.1 Comportamiento

| Condición | Acción |
|-----------|--------|
| Forma de pago con `requiereEntidad: false` | Se muestra botón **"Consumidor Final"** (id: 0). Usuario puede seleccionarlo directamente o buscar otro cliente |
| Forma de pago con `requiereEntidad: true` (ej: Cta Corriente) | Se oculta el botón Consumidor Final. El usuario debe seleccionar un cliente existente vía búsqueda. Se muestra alerta: "Las cuentas corrientes requieren un titular" |

### 4.2 Selección

- Botón **"Consumidor Final"** — selecciona `{ id: 0, nombre: "Consumidor Final" }`
- Botón **"Buscar cliente..."** — abre `SelectorEntidadModal` con búsqueda y listado de clientes
- La fuente de datos es `entidadService` contra la tabla `db_clientes`

---

## 5. Formas de Pago por Organización

### 5.1 Concepto

Cada organización puede definir su propio listado de formas de pago, adaptando:
- Nombres personalizados
- Formas de pago habilitadas
- Vocabulario del cliente
- Propiedades de comportamiento por forma de pago

### 5.2 Propiedades de cada Forma de Pago

Cada forma de pago tiene tres propiedades booleanas configurables:

| Propiedad | Default | Descripción |
|-----------|---------|-------------|
| `requiereEntidad` | false | Si al seleccionar esta forma de pago se debe elegir un cliente obligatoriamente |
| `impactaCaja` | false | Si el movimiento impacta en el saldo de caja física |
| `impactaCtaCte` | false | Si el movimiento afecta la cuenta corriente del cliente seleccionado |

### 5.3 Almacenamiento

```js
// localStorage key: org_config_{orgId}
{
  formasPago: {
    Venta: [
      { key: "Efectivo", label: "Efectivo", enabled: true, requiereEntidad: false, impactaCaja: true, impactaCtaCte: false },
      { key: "Cta Corriente", label: "Cta. Cte.", enabled: true, requiereEntidad: true, impactaCaja: false, impactaCtaCte: true },
    ]
  }
}
```

> Solo se usa `Venta` como tipo (los demás tipos de movimiento no están activos en mobile).

### 5.4 Mecanismo

1. `orgService.getFormasPago(orgId, "Venta")` retorna las formas de pago configuradas
2. Si no hay configuración, usa `FORMAS_PAGO` de `posConstants.jsx` como default
3. `StepFormaPago` consume este servicio con tipo `"Venta"`
4. Las propiedades se configuran desde la página `/more/formas-pago`

### 5.5 Página de Configuración

`FormasPagoConfigPage` (`/more/formas-pago`) permite:
- Ver todas las formas de pago con sus propiedades
- Activar/desactivar formas de pago
- Toggle `requiereEntidad`, `impactaCaja`, `impactaCtaCte`
- Persistir por organización

---

## 6. Modelo de datos del movimiento

```js
{
  tipo: "Venta",                     // fijo, único tipo soportado
  importe: number,                    // suma total de lineItems
  lineItems: [                        // detalle de items
    {
      id: number,                     // Date.now()
      importe: number,                // monto del item (sin decimales, enteros)
      rubro: {
        sigla: "V" | "K" | "B" | "F" | "P",
        nombre: "Varios" | "Kiosco" | "Bebidas" | "Frutas/Verduras" | "Panadería",
        grupo: "General" | "Alimentos"
      }
    },
  ],
  formaPago: string | null,
  entidad: { id: number, nombre: string } | null,   // null = Consumidor Final
}
```

---

## 7. Componentes

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| `POSAnotaloMobile` | `pages/POSAnotalo/POSAnotaloMobile.jsx` | Orquestador del wizard mobile con BottomNav |
| `StepImporte` | `components/steps/StepImporte.jsx` | Calculadora + selección de rubro + lista de items (editar/eliminar) |
| `StepFormaPago` | `components/steps/StepFormaPago.jsx` | Selección de forma de pago |
| `StepEntidad` | `components/steps/StepEntidad.jsx` | Selección de cliente con default "Consumidor Final" |
| `StepConfirmar` | `components/steps/StepConfirmar.jsx` | Confirmación y registro |
| `Calculadora` | `components/steps/components/Calculadora.jsx` | Teclado numérico táctil |
| `SelectorEntidadModal` | `components/steps/components/SelectorEntidadModal.jsx` | Modal de búsqueda de clientes |
| `PosHeader` | `components/PosHeader.jsx` | **No utilizado actualmente** (código muerto) |
| `StepTipo` | `components/steps/StepTipo.jsx` | **No utilizado actualmente** (código muerto) |

---

## 8. Hooks

| Hook | Archivo | Descripción |
|------|---------|-------------|
| `usePosFlow` | `hooks/usePosFlow.js` | Estado y navegación del wizard. `currentStep` se inicializa en `STEPS.IMPORTE` |

---

## 9. Constantes

| Constante | Archivo | Descripción |
|-----------|---------|-------------|
| `MOVIMIENTO_TIPOS` | `constants/posConstants.jsx` | Tipos de movimiento (solo Venta activo) |
| `POS_COLORS` | `constants/posConstants.jsx` | Colores por tipo |
| `OPCIONES_TIPO` | `constants/posConstants.jsx` | Opciones de tipo (no usado en mobile) |
| `FORMAS_PAGO` | `constants/posConstants.jsx` | Formas de pago default |
| `STEPS` | `constants/posConstants.jsx` | Índices de pasos (TIPO=0 no usado) |
| `VISOR_CONFIG` | `constants/posConstants.jsx` | Config del visor de importe |

---

## 10. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/POSAnotalo/POSAnotalo.jsx` | Router mobile/desktop según DeviceContext |
| `src/pages/POSAnotalo/POSAnotaloMobile.jsx` | Orquestador del wizard mobile |
| `src/pages/POSAnotalo/POSAnotaloDesktop.jsx` | Versión desktop (ver spec independiente) |
| `src/pages/POSAnotalo/components/steps/StepImporte.jsx` | Paso ingreso de múltiples importes con rubro |
| `src/pages/POSAnotalo/components/steps/StepFormaPago.jsx` | Paso forma de pago |
| `src/pages/POSAnotalo/components/steps/StepEntidad.jsx` | Paso selección de cliente |
| `src/pages/POSAnotalo/components/steps/StepConfirmar.jsx` | Paso confirmación |
| `src/pages/POSAnotalo/components/steps/components/Calculadora.jsx` | Teclado numérico |
| `src/pages/POSAnotalo/components/steps/components/SelectorEntidadModal.jsx` | Modal de clientes |
| `src/pages/POSAnotalo/hooks/usePosFlow.js` | Hook del flujo |
| `src/constants/posConstants.jsx` | Constantes del POS |
| `src/services/orgService.js` | Servicio de config por organización |
| `src/services/entidadService.js` | Servicio de entidades (clientes) |
| `src/services/movimientoService.js` | Servicio de persistencia de movimientos |
| `src/pages/FormasPagoConfig/FormasPagoConfigPage.jsx` | Configuración visual de formas de pago |
| `src/pages/POSAnotalo/components/PosHeader.jsx` | **No utilizado** |
| `src/pages/POSAnotalo/components/steps/StepTipo.jsx` | **No utilizado** |
| `sdd/spec_PosAnotaloDesktop.md` | Especificación desktop |
| `sdd/spec_PosAnotaloMobile.md` | Esta especificación |
| `sdd/spec_config.md` | Configuración por organización |
