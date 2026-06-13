# SDD - POS Anotalo Desktop

## Especificación del Módulo POS — Versión Desktop (Punto de Venta Full)

**Versión:** 0.2
**Fecha:** 10/06/2026
**Propósito:** Definir la arquitectura del módulo POS en su versión desktop, orientada a Punto de Venta Full con soporte para lectora de código de barras, teclado físico y layout de 3 zonas.

---

## 0. Vista General

`POSAnotaloDesktop.jsx` se renderiza cuando `useDevice().isDesktop` es `true`. Proporciona un layout de 3 zonas con sidebar de transacción siempre visible, navegación por teclado y soporte para ingreso rápido mediante lectora de barras.

---

## 1. Layout Desktop

### 1.1 Estructura

```
┌─────────────────────────────────────────────────────────────────┐
│  TOP HEADER: POS Anotalo · [Tipo Tag]          [Cerrar]        │
├──────────────────────────────────┬──────────────────────────────┤
│  LEFT PANEL — Step Content       │  RIGHT SIDEBAR               │
│  ┌────────────────────────────┐  │  ┌────────────────────────┐  │
│  │ ← Step Title    ● ● ○ ○ ○ │  │  │ TRANSACCIÓN ACTUAL     │  │
│  ├────────────────────────────┤  │  ├────────────────────────┤  │
│  │                            │  │  │ Tipo: Venta            │  │
│  │    [Step content centered  │  │  │ Importe: $5,000        │  │
│  │     max-width: 480px]      │  │  │ Forma Pago: Efectivo   │  │
│  │                            │  │  │ Entidad: Cons. Final   │  │
│  │                            │  │  │                        │  │
│  └────────────────────────────┘  │  └────────────────────────┘  │
├──────────────────────────────────┴──────────────────────────────┤
│  BOTTOM BAR: MOVIMIENTOS RECIENTES (horizontal scroll, 6 cards)  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Zonas

| Zona | Descripción |
|------|-------------|
| **Top Header** | Logo POS + tipo activo + botón cerrar (Escape para cerrar) |
| **Left Panel** | Paso actual centrado (reutiliza componentes de mobile) con step indicator (dots) |
| **Right Sidebar** | Resumen de la transacción en curso (siempre visible) |
| **Bottom Bar** | Últimos 6 movimientos en cards horizontales, auto-refresh |

### 1.3 Navegación por teclado

| Tecla | Acción |
|-------|--------|
| Escape | Retrocede al paso anterior; en paso 1 cierra el POS |
| Enter (en input importe) | Agrega el monto a la lista (no avanza de paso) |

### 1.4 Flujo de pasos

El flujo recorre los mismos 5 pasos que mobile, reutilizando los mismos componentes:

`StepTipo` → `StepImporte` → `StepFormaPago` → `StepEntidad` → `StepConfirmar`

El sidebar se actualiza a medida que se completan los datos.

---

## 2. Lectora de Código de Barras

El módulo desktop soporta entrada desde lectora de código de barras (lectora USB que emula teclado).

### 2.1 Comportamiento

- La lectora se detecta automáticamente por la velocidad de tipeo (los lectores emiten caracteres en ráfaga < 50ms entre caracteres)
- El input del paso Importe captura la ráfaga completa como un solo valor
- Al detectar un código de barras válido (numérico), se agrega automáticamente a la lista de items (sin necesidad de presionar Enter)
- Si el código incluye prefijos/sufijos (como FNC1 en GS1-128), se sanitiza automáticamente dejando solo dígitos

### 2.2 Estrategia de detección

```js
// Pseudo:
let buffer = [], lastTime = 0
onKeyDown(e) {
  const now = Date.now()
  if (now - lastTime < 50) buffer.push(e.key)
  else buffer = [e.key]
  lastTime = now
  if (buffer.length > 3 && now - lastTime > 100) {
    const code = buffer.join('')
    // validar y agregar
  }
}
```

### 2.3 Integración en el flujo

- Si el usuario escanea un código en cualquier paso que no sea Importe, se ignora o se muestra un tooltip indicando "Escanea en el paso Importe"
- Si el usuario está en el paso Importe, el código escaneado se agrega automáticamente como un item más

---

## 3. Comportamiento Desktop en Paso Importe

- El input de texto acepta entrada por teclado físico
- Enter en el input ejecuta "AGREGAR" (no continúa al siguiente paso)
- La calculadora táctil es toggleable con el botón "Mostrar teclado"
- La lectora de barras agrega items automáticamente (ver sección 2)

---

## 4. Formas de Pago por Organización

### 4.1 Concepto

Cada organización puede definir su propio listado de formas de pago, adaptando:
- Nombres personalizados
- Formas de pago habilitadas
- Vocabulario del cliente
- Propiedades de comportamiento por forma de pago

### 4.2 Propiedades de cada Forma de Pago

Cada forma de pago tiene tres propiedades booleanas configurables:

| Propiedad | Default | Descripción |
|-----------|---------|-------------|
| `requiereEntidad` | false | Si al seleccionar esta forma de pago se debe elegir una entidad (cliente/proveedor) |
| `impactaCaja` | false | Si el movimiento impacta en el saldo de caja física |
| `impactaCtaCte` | false | Si el movimiento afecta la cuenta corriente de la entidad seleccionada |

### 4.3 Almacenamiento

```js
// localStorage key: org_config_{orgId}
{
  formasPago: {
    Venta: [
      { key: "Efectivo", label: "Efectivo", enabled: true, requiereEntidad: false, impactaCaja: true, impactaCtaCte: false },
      { key: "Cta Corriente", label: "Cta. Cte.", enabled: true, requiereEntidad: true, impactaCaja: false, impactaCtaCte: true },
      // ...
    ],
    Pago: [
      { key: "Transferencia", label: "Transferencia", enabled: true, requiereEntidad: false, impactaCaja: false, impactaCtaCte: false },
      // ...
    ]
  }
}
```

### 4.4 Mecanismo

1. `orgService.getFormasPago(orgId, tipo)` retorna las formas de pago configuradas para la org según el tipo (Venta/Pago)
2. Si no hay configuración, usa `FORMAS_PAGO` de `posConstants.jsx` como default
3. `StepFormaPago` consume este servicio con el tipo actual del movimiento
4. Las propiedades se configuran desde la página `/more/formas-pago`

### 4.5 Página de Configuración

`FormasPagoConfigPage` (`/more/formas-pago`) permite:
- Ver todas las formas de pago con sus propiedades
- Activar/desactivar formas de pago por tipo (Venta/Pago)
- Toggle `requiereEntidad`, `impactaCaja`, `impactaCtaCte`
- Persistir por organización

---

## 5. Modelo de datos del movimiento

El objeto `movimiento` incluye un array `lineItems` que almacena el detalle de los importes individuales:

```js
{
  tipo: "Venta" | "Pago" | "Retiro" | "Ingreso" | "Cobro" | null,
  importe: number,              // suma total de lineItems
  lineItems: [                  // detalle de items
    { id: number, importe: number },
  ],
  formaPago: string | null,
  entidad: { id: number, nombre: string } | null,
}
```

---

## 6. Flujo del paso Importe (multi-importe)

El paso `StepImporte` permite cargar múltiples montos antes de continuar:

1. El usuario ingresa un monto en el visor usando la calculadora táctil o teclado físico
2. Presiona **"AGREGAR"** para añadir el monto a la lista de items
3. El visor se resetea a 0 para ingresar el próximo monto
4. Cada item se muestra en una lista con su importe y un botón de eliminar (✕)
5. El total acumulado se actualiza automáticamente
6. Al presionar **"CONTINUAR"**, se envía `{ importe: total, lineItems }` al hook `usePosFlow`

**Validaciones:**
- No se permite agregar un monto de 0
- Cada item respeta el límite de `VISOR_CONFIG.MAX_DIGITOS` (12 dígitos)
- El botón CONTINUAR se deshabilita si no hay al menos 1 item en la lista
- Al navegar hacia atrás desde pasos posteriores, los `lineItems` se restauran desde el estado del movimiento

---

## 7. Componentes

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| `POSAnotaloDesktop` | `pages/POSAnotalo/POSAnotaloDesktop.jsx` | Layout desktop: header + left panel + right sidebar + bottom bar |
| `PosHeader` | `components/PosHeader.jsx` | Header con título, back y close |
| `StepTipo` | `components/steps/StepTipo.jsx` | Selección de tipo (full-width cards) |
| `StepImporte` | `components/steps/StepImporte.jsx` | Calculadora + multi-importe + soporte lectora barras |
| `StepFormaPago` | `components/steps/StepFormaPago.jsx` | Selección de forma de pago |
| `StepEntidad` | `components/steps/StepEntidad.jsx` | Selección de entidad |
| `StepConfirmar` | `components/steps/StepConfirmar.jsx` | Confirmación y registro |
| `Calculadora` | `components/steps/components/Calculadora.jsx` | Teclado numérico táctil |
| `SelectorEntidadModal` | `components/steps/components/SelectorEntidadModal.jsx` | Modal de búsqueda de entidades |
| `SidebarTransaccion` | `components/SidebarTransaccion.jsx` | Resumen de transacción actual (sidebar derecho) |
| `MovimientosRecientes` | `components/MovimientosRecientes.jsx` | Cards horizontales de últimos movimientos |

---

## 8. Hooks

| Hook | Archivo | Descripción |
|------|---------|-------------|
| `usePosFlow` | `hooks/usePosFlow.js` | Estado y navegación del wizard |
| `useBarcodeScanner` | `hooks/useBarcodeScanner.js` | Detección de lectora de código de barras |

---

## 9. Constantes

| Constante | Archivo | Descripción |
|-----------|---------|-------------|
| `MOVIMIENTO_TIPOS` | `constants/posConstants.jsx` | Tipos de movimiento |
| `POS_COLORS` | `constants/posConstants.jsx` | Colores por tipo |
| `OPCIONES_TIPO` | `constants/posConstants.jsx` | Opciones de tipo (icono, label, desc) |
| `FORMAS_PAGO` | `constants/posConstants.jsx` | Formas de pago default |
| `STEPS` | `constants/posConstants.jsx` | Índices de pasos |
| `VISOR_CONFIG` | `constants/posConstants.jsx` | Config del visor de importe |

---

## 10. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/POSAnotalo/POSAnotalo.jsx` | Router mobile/desktop según DeviceContext |
| `src/pages/POSAnotalo/POSAnotaloDesktop.jsx` | Layout desktop con sidebar + movimientos recientes |
| `src/pages/POSAnotalo/POSAnotaloMobile.jsx` | Versión mobile (ver spec independiente) |
| `src/pages/POSAnotalo/components/PosHeader.jsx` | Header del POS |
| `src/pages/POSAnotalo/components/steps/StepTipo.jsx` | Paso selección tipo |
| `src/pages/POSAnotalo/components/steps/StepImporte.jsx` | Paso ingreso de múltiples importes |
| `src/pages/POSAnotalo/components/steps/StepFormaPago.jsx` | Paso forma de pago |
| `src/pages/POSAnotalo/components/steps/StepEntidad.jsx` | Paso selección entidad |
| `src/pages/POSAnotalo/components/steps/StepConfirmar.jsx` | Paso confirmación |
| `src/pages/POSAnotalo/components/steps/components/Calculadora.jsx` | Teclado numérico |
| `src/pages/POSAnotalo/components/steps/components/SelectorEntidadModal.jsx` | Modal entidades |
| `src/pages/POSAnotalo/components/SidebarTransaccion.jsx` | Sidebar resumen transacción |
| `src/pages/POSAnotalo/components/MovimientosRecientes.jsx` | Barra de movimientos recientes |
| `src/pages/POSAnotalo/hooks/usePosFlow.js` | Hook del flujo |
| `src/pages/POSAnotalo/hooks/useBarcodeScanner.js` | Hook detección lectora barras |
| `src/constants/posConstants.jsx` | Constantes del POS |
| `src/services/orgService.js` | Servicio de config por organización |
| `src/pages/FormasPagoConfig/FormasPagoConfigPage.jsx` | Configuración visual de formas de pago |
| `sdd/spec_PosAnotaloDesktop.md` | Esta especificación |
| `sdd/spec_PosAnotaloMobile.md` | Especificación mobile |
| `sdd/spec_config.md` | Configuración por organización |
