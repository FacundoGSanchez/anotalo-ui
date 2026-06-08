# SDD - POS Anotalo

## Especificación del Módulo POS (Punto de Venta)

**Versión:** 0.1
**Fecha:** 07/06/2026
**Propósito:** Definir la arquitectura del módulo POS, el flujo de registro de movimientos y la configuración por organización.

---

## 0. Versiones por Dispositivo

El módulo POS tiene dos implementaciones según el dispositivo detectado por `DeviceContext`:

| Versión | Componente | Descripción |
|---------|-----------|-------------|
| Mobile | `POSAnotaloMobile.jsx` | Wizard táctil de 5 pasos (Tipo → Importe → FormaPago → Entidad → Confirmar) |
| Desktop | `POSAnotaloDesktop.jsx` | Layout de 3 zonas: header + body (step + sidebar transacción) + movimientos recientes |

`POSAnotalo.jsx` actúa como router: consulta `useDevice().isDesktop` y renderiza el componente correspondiente.

## 1. Flujo del Wizard (Mobile)

```
TIPO → IMPORTE → FORMA_PAGO → ENTIDAD → CONFIRMAR
  0        1           2           3          4
```

### 1.1 Pasos

| Paso | Componente | Descripción |
|------|-----------|-------------|
| 0 - TIPO | `StepTipo.jsx` | Selección del tipo de movimiento (Venta, Pago, Ingreso, Retiro) |
| 1 - IMPORTE | `StepImporte.jsx` | Ingreso del importe con calculadora táctil |
| 2 - FORMA_PAGO | `StepFormaPago.jsx` | Selección de forma de pago (personalizable por org) |
| 3 - ENTIDAD | `StepEntidad.jsx` | Selección de cliente/proveedor |
| 4 - CONFIRMAR | `StepConfirmar.jsx` | Resumen y confirmación del registro |

### 1.2 Navegación

- `usePosFlow` hook maneja el estado del wizard
- `handleNext(data)` avanza al siguiente paso acumulando datos
- `handleBack()` retrocede al paso anterior
- `closePos()` cierra/navega fuera del POS

---

## 2. Layout Desktop

### 2.1 Estructura

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

### 2.2 Zonas

| Zona | Descripción |
|------|-------------|
| **Top Header** | Logo POS + tipo activo + botón cerrar (Escape para cerrar) |
| **Left Panel** | Paso actual centrado (reutiliza componentes de mobile) con step indicator (dots) |
| **Right Sidebar** | Resumen de la transacción en curso (siempre visible) |
| **Bottom Bar** | Últimos 6 movimientos en cards horizontales, auto-refresh |

### 2.3 Navegación por teclado

| Tecla | Acción |
|-------|--------|
| Escape | Retrocede al paso anterior; en paso 1 cierra el POS |

### 2.4 Paso a paso

Al igual que en mobile, el flujo recorre los mismos 5 pasos reutilizando los mismos componentes:
`StepTipo` → `StepImporte` → `StepFormaPago` → `StepEntidad` → `StepConfirmar`

El sidebar se actualiza a medida que se completan los datos.

---

## 3. Layout Mobile (Wizard)

### 3.1 Contenedor

```
┌─────────────────────────────────────┐
│  PosHeader (~40px)                  │
├─────────────────────────────────────┤
│  Contenido del paso (variable)      │
│  - Sin scroll vertical excesivo     │
│  - Botón de acción siempre visible  │
├─────────────────────────────────────┤
│  BottomNav (64px) — SOLO MOBILE     │
└─────────────────────────────────────┘
```

### 3.2 Alturas máximas recomendadas

| Elemento | Altura |
|----------|--------|
| PosHeader | 40px |
| Card contenedor padding | 12px |
| Visor importe | 80px |
| Botones de acción | 44px |
| Cards de tipo/forma pago | ~72px |
| Step label (footer) | 16px |

> El contenido total debe ocupar menos del 100vh - 64px (BottomNav) para evitar scroll innecesario.

---

## 3. Formas de Pago por Organización

### 3.1 Concepto

Cada organización puede definir su propio listado de formas de pago, adaptando:
- Nombres personalizados
- Formas de pago habilitadas
- Vocabulario del cliente
- Propiedades de comportamiento por forma de pago

### 3.2 Propiedades de cada Forma de Pago

Cada forma de pago tiene tres propiedades booleanas configurables:

| Propiedad | Default | Descripción |
|-----------|---------|-------------|
| `requiereEntidad` | false | Si al seleccionar esta forma de pago se debe elegir una entidad (cliente/proveedor) |
| `impactaCaja` | false | Si el movimiento impacta en el saldo de caja física |
| `impactaCtaCte` | false | Si el movimiento afecta la cuenta corriente de la entidad seleccionada |

### 3.3 Almacenamiento

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

### 3.4 Mecanismo

1. `orgService.getFormasPago(orgId, tipo)` retorna las formas de pago configuradas para la org según el tipo (Venta/Pago)
2. Si no hay configuración, usa `FORMAS_PAGO` de `posConstants.jsx` como default
3. `StepFormaPago` consume este servicio con el tipo actual del movimiento
4. Las propiedades se configuran desde la página `/more/formas-pago`

### 3.5 Página de Configuración

`FormasPagoConfigPage` (`/more/formas-pago`) permite:
- Ver todas las formas de pago con sus propiedades
- Activar/desactivar formas de pago por tipo (Venta/Pago)
- Toggle `requiereEntidad`, `impactaCaja`, `impactaCtaCte`
- Persistir por organización

---

## 4. Componentes

| Componente | Archivo | Descripción |
|------------|---------|-------------|
| `PosHeader` | `components/PosHeader.jsx` | Header con título, back y close |
| `StepTipo` | `components/steps/StepTipo.jsx` | Selección de tipo (full-width cards) |
| `StepImporte` | `components/steps/StepImporte.jsx` | Calculadora + visor de importe |
| `StepFormaPago` | `components/steps/StepFormaPago.jsx` | Selección de forma de pago |
| `StepEntidad` | `components/steps/StepEntidad.jsx` | Selección de entidad |
| `StepConfirmar` | `components/steps/StepConfirmar.jsx` | Confirmación y registro |
| `Calculadora` | `components/steps/components/Calculadora.jsx` | Teclado numérico táctil |
| `SelectorEntidadModal` | `components/steps/components/SelectorEntidadModal.jsx` | Modal de búsqueda de entidades |

---

## 5. Hooks

| Hook | Archivo | Descripción |
|------|---------|-------------|
| `usePosFlow` | `hooks/usePosFlow.js` | Estado y navegación del wizard |

---

## 6. Constantes

| Constante | Archivo | Descripción |
|-----------|---------|-------------|
| `MOVIMIENTO_TIPOS` | `constants/posConstants.jsx` | Tipos de movimiento |
| `POS_COLORS` | `constants/posConstants.jsx` | Colores por tipo |
| `OPCIONES_TIPO` | `constants/posConstants.jsx` | Opciones de tipo (icono, label, desc) |
| `FORMAS_PAGO` | `constants/posConstants.jsx` | Formas de pago default |
| `STEPS` | `constants/posConstants.jsx` | Índices de pasos |
| `VISOR_CONFIG` | `constants/posConstants.jsx` | Config del visor de importe |

---

## 7. Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/pages/POSAnotalo/POSAnotalo.jsx` | Router mobile/desktop según DeviceContext |
| `src/pages/POSAnotalo/POSAnotaloMobile.jsx` | Orquestador del wizard mobile |
| `src/pages/POSAnotalo/POSAnotaloDesktop.jsx` | Layout desktop con sidebar + movimientos recientes |
| `src/pages/POSAnotalo/components/PosHeader.jsx` | Header del POS |
| `src/pages/POSAnotalo/components/steps/StepTipo.jsx` | Paso selección tipo |
| `src/pages/POSAnotalo/components/steps/StepImporte.jsx` | Paso ingreso importe |
| `src/pages/POSAnotalo/components/steps/StepFormaPago.jsx` | Paso forma de pago |
| `src/pages/POSAnotalo/components/steps/StepEntidad.jsx` | Paso selección entidad |
| `src/pages/POSAnotalo/components/steps/StepConfirmar.jsx` | Paso confirmación |
| `src/pages/POSAnotalo/components/steps/components/Calculadora.jsx` | Teclado numérico |
| `src/pages/POSAnotalo/components/steps/components/SelectorEntidadModal.jsx` | Modal entidades |
| `src/pages/POSAnotalo/hooks/usePosFlow.js` | Hook del flujo |
| `src/constants/posConstants.jsx` | Constantes del POS |
| `src/services/orgService.js` | Servicio de config por organización |
| `src/pages/FormasPagoConfig/FormasPagoConfigPage.jsx` | Configuración visual de formas de pago |
| `sdd/spec_PosAnotalo.md` | Esta especificación |
| `sdd/spec_config.md` | Configuración por organización |
