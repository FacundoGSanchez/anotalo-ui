# SDD - POS Anotalo Mobile

## Especificación del Módulo POS — Versión Mobile (Wizard Táctil)

**Versión:** 0.5
**Fecha:** 09/07/2026
**Propósito:** Definir la arquitectura del módulo POS mobile. Actualmente solo opera con movimiento **Venta** (tipo fijo). Wizard táctil de 4 pasos optimizado para pantallas pequeñas, sin soporte de lectora de barras.

---

## 0. Vista General

`POSAnotaloMobile.jsx` se renderiza cuando `useDevice().isDesktop` es `false`. El tipo de movimiento está fijo en `"Venta"` — no hay paso de selección de tipo. `StepTipo.jsx` existe pero no se utiliza (código muerto). `PosHeader.jsx` se usa activamente en el wrapper del wizard mostrando el título del paso actual y botones de volver/cerrar.

---

## 1. Flujo del Wizard

Los pasos se definen en la constante `STEPS` de `posConstants.jsx`:

```
TIPO → IMPORTE → FORMA_PAGO → [ENTIDAD] → CONFIRMAR
 0        1           2           3           4
```

- **TIPO (índice 0) no se utiliza** en mobile — el tipo de movimiento es siempre `"Venta"`. `StepTipo.jsx` existe como código muerto.
- **ENTIDAD (índice 3) se salta** únicamente si ya hay una entidad cargada en `movimiento.entidad` (por ej. si se preinicializó desde el estado del movimiento). No se salta basado en `requiereEntidad` — en ese caso el paso ENTIDAD se muestra igual pero con el botón "Consumidor Final" como acceso rápido.

### 1.1 Pasos

| Paso           | Componente          | Descripción                                                                                                                                                                                                                 |
| -------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 - IMPORTE    | `StepImporte.jsx`   | Ingreso de múltiples items con importe + rubro vía calculadora táctil. Cada item se agrega a la lista con su rubro asociado. Se puede editar el rubro o eliminar el item. Se muestra el total acumulado                     |
| 2 - FORMA_PAGO | `StepFormaPago.jsx` | Selección de forma de pago con soporte de **pago múltiple** (split de importe entre varios medios). Personalizable por org                                                                                                  |
| 3 - ENTIDAD    | `StepEntidad.jsx`   | Selección de cliente. Si la forma de pago no requiere entidad, se ofrece botón "Consumidor Final" como default. Si `requiereEntidad` es `true` (en cualquiera de los medios seleccionados), obliga a seleccionar un cliente |
| 4 - CONFIRMAR  | `StepConfirmar.jsx` | Resumen del movimiento (items, medios de pago, entidad) y confirmación del registro                                                                                                                                         |

### 1.2 Navegación

- `usePosFlow` hook maneja el estado del wizard
- `currentStep` se inicializa en `STEPS.IMPORTE` (índice 1)
- `handleNext(data)` avanza al siguiente paso acumulando datos:
  - Desde `IMPORTE` → siempre va a `FORMA_PAGO`
  - Desde `FORMA_PAGO` → si `movimiento.entidad` ya existe salta a `CONFIRMAR`; si no, va a `ENTIDAD`
  - Desde cualquier otro paso → incrementa en 1
- `handleBack()` retrocede con smart tracing:
  - Desde `CONFIRMAR` retrocede a `ENTIDAD` (si hay entidad), `FORMA_PAGO` (si hay forma de pago), o `IMPORTE` (fallback)
  - Desde `IMPORTE` confirma salida y cierra el POS
  - Desde otros pasos → decrementa en 1
- `closePos()` cierra/navega fuera del POS

### 1.3 Pago Múltiple

`StepFormaPago` incluye un toggle **"PAGO MÚLTIPLE"** que permite dividir el importe total entre varias formas de pago.

**Flujo:**

1. Usuario activa el toggle → las tarjetas de forma de pago muestran checkboxes
2. Al marcar una forma de pago, se asigna automáticamente el saldo restante como importe
3. El usuario puede tocar el importe asignado para abrir la calculadora y ajustar el monto
4. Una barra de resumen muestra **TOTAL**, **ASIGNADO** y **SALDO**:
   - Verde cuando `saldo === 0` (todo asignado)
   - Amarillo cuando `saldo > 0` (pendiente de asignar)
5. El botón **CONTINUAR** se habilita solo cuando `saldo === 0`
6. Al continuar se envía `{ formaPago: primerKey, formaPagos: [{ key, importe }, ...] }`

**Modo single (toggle off):** un toque en cualquier tarjeta selecciona esa forma de pago con el importe total y avanza al siguiente paso inmediatamente.

**Persistencia:** los montos asignados se mantienen en el estado `selected` del componente mientras el modal esté abierto. Si se cierra, se descartan.

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

> `PosHeader.jsx` se usa activamente mostrando el título del paso actual, botón volver y botón cerrar.

### 2.2 Alturas máximas recomendadas

| Elemento                | Altura |
| ----------------------- | ------ |
| Card contenedor padding | 12px   |
| Visor importe           | 80px   |
| Botones de acción       | 44px   |
| Cards de forma pago     | ~72px  |
| Step label (footer)     | 16px   |

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

| Condición                                                     | Acción                                                                                                                                                               |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Forma de pago con `requiereEntidad: false`                    | Se muestra botón **"Consumidor Final"** (id: 0). Usuario puede seleccionarlo directamente o buscar otro cliente                                                      |
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

| Propiedad         | Default | Descripción                                                                     |
| ----------------- | ------- | ------------------------------------------------------------------------------- |
| `requiereEntidad` | false   | Si al seleccionar esta forma de pago se debe elegir un cliente obligatoriamente |
| `impactaCaja`     | false   | Si el movimiento impacta en el saldo de caja física                             |
| `impactaCtaCte`   | false   | Si el movimiento afecta la cuenta corriente del cliente seleccionado            |

### 5.3 Almacenamiento

```js
// localStorage key: org_config_{orgId}
{
  formasPago: {
    Venta: [
      {
        key: "Efectivo",
        label: "Efectivo",
        enabled: true,
        requiereEntidad: false,
        impactaCaja: true,
        impactaCtaCte: false,
      },
      {
        key: "Cta Corriente",
        label: "Cta. Cte.",
        enabled: true,
        requiereEntidad: true,
        impactaCaja: false,
        impactaCtaCte: true,
      },
    ];
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
  formaPago: string | null,           // clave de la primera/única forma de pago (backward compat)
  formaPagos: [                       // arreglo completo de medios de pago (soporta multi-pago)
    { key: string, importe: number }
  ],
  entidad: { id: number, nombre: string } | null,   // null = Consumidor Final
}
```

> `formaPagos` siempre se envía aunque sea un solo medio. `formaPago` se mantiene como primer elemento del arreglo para compatibilidad.

---

## 6. Paso Forma de Pago

### 6.1 Modo Single (toggle OFF)

En modo single el usuario toca una tarjeta y avanza inmediatamente al siguiente paso.

```
┌──────────────────────────────┐
│  PAGO MÚLTIPLE      [○──]   │  ← Switch apagado
├──────────────────────────────┤
│  ┌────────────────────────┐  │
│  │ EFECTIVO          [★]  │  │  ← tarjeta clickeable
│  └────────────────────────┘  │     (un toque → avanza)
│  ┌────────────────────────┐  │
│  │ TARJETA DÉBITO    [★]  │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ MERCADO PAGO      [★]  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

- Cada tarjeta muestra label + ícono a la derecha (color de la FP)
- `onClick` → `handleSingleSelect(key)` → emite `{ formaPago: key, formaPagos: [{ key, importe }] }` y avanza
- Sin checkboxes, sin barra de resumen, sin botón CONTINUAR
- Las tarjetas soportan navegación por teclado (ArrowUp/ArrowDown)

### 6.2 Modo Multi-pago (toggle ON)

El usuario activa el toggle para dividir el importe entre varios medios.

```
┌──────────────────────────────┐
│  PAGO MÚLTIPLE      [●●]   │  ← Switch encendido
├──────────────────────────────┤
│  ☐  EFECTIVO          $ 0   │  ← checkbox + importe texto
│  ☑  TARJETA DÉBITO   $ 700  │  ← tocable → abre modal
│  ☐  MERCADO PAGO     $ 0    │
├──────────────────────────────┤
│ TOTAL $1.000  ASIGNADO $700  │  ← barra resumen
│                 SALDO $300   │
├──────────────────────────────┤
│ [  CONTINUAR ($300 pend.)  ] │  ← solo activo si saldo=0
└──────────────────────────────┘
```

**Flujo:**

1. Switch ON → tarjetas muestran checkbox + importe como texto
2. Check en una FP → `handleCheck(key, true)`:
   - Si es la primera → se asigna `importe` total
   - Si hay otras → se asigna el saldo restante
   - Se abre automáticamente `CalcMultipleFormaPago` para ajustar el monto
3. Tocar el importe de una FP ya checkeada → re-abre `CalcMultipleFormaPago`
4. La barra de resumen muestra TOTAL | ASIGNADO | SALDO:
   - Verde si `saldo === 0`
   - Amarillo si `saldo > 0`
5. Botón CONTINUAR habilitado solo cuando `saldo === 0` y hay al menos una FP seleccionada
6. Al continuar → emite `{ formaPago: primerKey, formaPagos: [{ key, importe }, ...] }`

### 6.3 Modal CalcMultipleFormaPago

Componente autocontenido (no depende de `Calculadora.jsx`). Se abre cuando el usuario checkea o toca el importe de una FP en multi-pago.

```
┌──────────────────────────────┐
│          EFECTIVO            │  ← título con color de la FP
│                              │
│ TOTAL    │ ASIGNADO │ SALDO  │  ← leyenda 3 columnas
│ $ 1.000  │  $ 700   │ $ 300  │
│                              │
│ ┌────────────────────────┐   │
│ │       $ 1.234          │   │  ← visor 42px, $ pegado
│ └────────────────────────┘   │
│                              │
│ ┌──┐ ┌──┐ ┌──┐              │
│ │1 │ │2 │ │3 │              │
│ ├──┤ ├──┤ ├──┤              │
│ │4 │ │5 │ │6 │              │
│ ├──┤ ├──┤ ├──┤              │
│ │7 │ │8 │ │9 │              │
│ ├──┤ ├──┤ ├──┤              │
│ │C │ │0 │ │⌫ │              │  ← C (clear) | 0 | ⌫ (backspace)
│ └──┘ └──┘ └──┘              │
│                              │
│ ┌──────────────────────────┐ │
│ │        CONFIRMAR         │ │  ← fuera del grid
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

**Funciones del teclado:**
| Tecla | Función | Descripción |
|-------|---------|-------------|
| `1-9` | `addDigit(n)` | Apila dígito en el visor (máx 12) |
| `0` | `addDigit("0")` | Apila dígito 0 |
| `C` | `clearValue()` | Reinicia visor a 0 |
| `⌫` | `handleBackspace()` | Elimina el último dígito (`Math.floor(prev / 10)`) |
| `CONFIRMAR` | `handleConfirm()` | Confirma el monto y cierra el modal |

**Props:**
```
{
  open: boolean,
  formaLabel: string,        // nombre de la FP
  formaColor: string,        // color de la FP
  initialValue: number,      // valor inicial a editar
  importe: number,           // total del movimiento
  saldo: number,             // saldo restante global
  onConfirm: (value) => void,
  onCancel: () => void,
}
```

**Leyenda:**
- `TOTAL` = `importe` (total del movimiento)
- `ASIGNADO` = `importe - saldo` (total asignado entre todas las FP)
- `SALDO` = `saldo` (restante por asignar)

---

## 7. Componentes

| Componente             | Archivo                                                | Descripción                                                                                                                                               |
| ---------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POSAnotaloMobile`     | `pages/POSAnotalo/POSAnotaloMobile.jsx`                | Orquestador del wizard mobile con wrapper white card                                                                                                      |
| `StepImporte`          | `components/steps/StepImporte.jsx`                     | Calculadora + selección de rubro + lista de items (editar/eliminar)                                                                                       |
| `StepFormaPago`        | `components/steps/StepFormaPago.jsx`                   | Selección de forma de pago con toggle de pago múltiple. En multi-pago: checkboxes, split de montos con calculadora por método, barra total/asignado/saldo |
| `StepEntidad`          | `components/steps/StepEntidad.jsx`                     | Selección de cliente con default "Consumidor Final". Soporta multi-pago: si algún medio requiere entidad, obliga a seleccionar                            |
| `StepConfirmar`        | `components/steps/StepConfirmar.jsx`                   | Confirmación y registro. Muestra todos los medios de pago (`formaPagos[]`) y detalle de lineItems colapsable                                              |
| `Calculadora`          | `components/steps/components/Calculadora.jsx`          | Teclado numérico táctil                                                                                                                                   |
| `CalcMultipleFormaPago`   | `components/steps/components/CalcMultipleFormaPago.jsx`   | Modal de calculadora para editar importe por forma de pago en multi-pago. Teclado inline (`C | 0 | ⌫`), leyenda TOTAL/ASIGNADO/SALDO, visor compacto 42px |
| `SelectorEntidadModal` | `components/steps/components/SelectorEntidadModal.jsx` | Modal de búsqueda de clientes                                                                                                                             |
| `PosHeader`            | `components/PosHeader.jsx`                             | Header del wizard con título del paso actual, botón volver y botón cerrar. Usado activamente                                                              |
| `StepTipo`             | `components/steps/StepTipo.jsx`                        | **No utilizado actualmente** (código muerto)                                                                                                              |

---

## 8. Hooks

| Hook         | Archivo               | Descripción                                                                    |
| ------------ | --------------------- | ------------------------------------------------------------------------------ |
| `usePosFlow` | `hooks/usePosFlow.js` | Estado y navegación del wizard. `currentStep` se inicializa en `STEPS.IMPORTE` |

---

## 9. Constantes

| Constante          | Archivo                      | Descripción                             |
| ------------------ | ---------------------------- | --------------------------------------- |
| `MOVIMIENTO_TIPOS` | `constants/posConstants.jsx` | Tipos de movimiento (solo Venta activo) |
| `POS_COLORS`       | `constants/posConstants.jsx` | Colores por tipo                        |
| `OPCIONES_TIPO`    | `constants/posConstants.jsx` | Opciones de tipo (no usado en mobile)   |
| `FORMAS_PAGO`      | `constants/posConstants.jsx` | Formas de pago default                  |
| `STEPS`            | `constants/posConstants.jsx` | Índices de pasos (TIPO=0 no usado)      |
| `VISOR_CONFIG`     | `constants/posConstants.jsx` | Config del visor de importe             |

---

## 10. Archivos involucrados

| Archivo                                                                     | Rol                                                                   |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `src/pages/POSAnotalo/POSAnotalo.jsx`                                       | Router mobile/desktop según DeviceContext                             |
| `src/pages/POSAnotalo/POSAnotaloMobile.jsx`                                 | Orquestador del wizard mobile                                         |
| `src/pages/POSAnotalo/POSAnotaloDesktop.jsx`                                | Versión desktop (ver spec independiente)                              |
| `src/pages/POSAnotalo/components/steps/StepImporte.jsx`                     | Paso ingreso de múltiples importes con rubro                          |
| `src/pages/POSAnotalo/components/steps/StepFormaPago.jsx`                   | Paso forma de pago                                                    |
| `src/pages/POSAnotalo/components/steps/StepEntidad.jsx`                     | Paso selección de cliente                                             |
| `src/pages/POSAnotalo/components/steps/StepConfirmar.jsx`                   | Paso confirmación                                                     |
| `src/pages/POSAnotalo/components/steps/components/Calculadora.jsx`          | Teclado numérico                                                      |
| `src/pages/POSAnotalo/components/steps/components/CalcMultipleFormaPago.jsx` | Modal calculadora multi-pago con teclado inline C/0/⌫ y leyenda 3 col |
| `src/pages/POSAnotalo/components/steps/components/SelectorEntidadModal.jsx` | Modal de clientes                                                     |
| `src/pages/POSAnotalo/hooks/usePosFlow.js`                                  | Hook del flujo                                                        |
| `src/constants/posConstants.jsx`                                            | Constantes del POS                                                    |
| `src/services/orgService.js`                                                | Servicio de config por organización                                   |
| `src/services/entidadService.js`                                            | Servicio de entidades (clientes)                                      |
| `src/services/movimientoService.js`                                         | Servicio de persistencia de movimientos                               |
| `src/pages/FormasPagoConfig/FormasPagoConfigPage.jsx`                       | Configuración visual de formas de pago                                |
| `src/pages/POSAnotalo/components/PosHeader.jsx`                             | Header del wizard (título, volver, cerrar)                            |
| `src/pages/POSAnotalo/components/steps/StepTipo.jsx`                        | **No utilizado**                                                      |
| `sdd/spec_PosAnotaloDesktop.md`                                             | Especificación desktop                                                |
| `sdd/spec_PosAnotaloMobile.md`                                              | Esta especificación                                                   |
| `sdd/spec_config.md`                                                        | Configuración por organización                                        |

## 99. Nuevos Cambios

### 99.1 Limpieza de código muerto ✅

- Eliminado `StepTipo.jsx` del proyecto
- El tipo de movimiento en mobile queda fijo como `"Venta"` (ya era el comportamiento actual)
- No existen referencias residuales a `StepTipo` en `src/`

### 99.2 Pago Múltiple — nuevo flujo de calculadora por forma de pago ✅

- **Check** en una forma de pago → abre automáticamente `CalcMultipleFormaPago` para ingresar el importe
- Eliminado `InputNumber` inline de cada línea → reemplazado por texto del importe (tocable para re-abrir la calculadora)
- `CalcMultipleFormaPago` (inicialmente `CalculadoraImporte`) incluye:
  - **Teclado numérico** inline con fila: C | 0 | ⌫
  - **Botón CONFIRMAR** separado, debajo del teclado, ancho completo
  - **Leyenda superior:** TOTAL | ASIGNADO | SALDO
- `Calculadora.jsx` modificada para soportar ambas interfaces:
  - `onPlus` para `StepImporte` (muestra 00 | 0 | +/AGREGAR)
  - `onClear`/`onUndo` para `CalculadoraImporte` (muestra DESHACER | 0 | C)

### 99.3 Eliminar botones "Volver" del footer de cada paso (mobile) ✅

- Mobile: quitado `onBack` de `StepFormaPago`, `StepEntidad` y `StepConfirmar` en `POSAnotaloMobile.jsx`
- La navegación hacia atrás se maneja exclusivamente desde `PosHeader`
- Desktop conserva `onBack` en los pasos (no tiene `PosHeader`)
- `StepImporte` ya tenía el botón Volver gated detrás de `desktop` — sin cambios necesarios

### 99.4 Consistencia validada ✅

- `StepImporte` en mobile (`desktop={false}`) no renderiza el botón Volver
- `PosHeader` recibe `onBack={handleBack}` y cubre todos los pasos del wizard

### 99.5 CalcMultipleFormaPago — teclado inline propio + swap C/⌫ + leyenda 3 col + visor compacto ✅

- Renombrado `CalculadoraImporte.jsx` → `CalcMultipleFormaPago.jsx`
- Componente ahora **autocontenido**: grid numérico inline sin depender de `Calculadora.jsx`
- Última fila del teclado: `C | 0 | ⌫` (antes era `DESHACER | 0 | C`)
- `C` (clear) a la izquierda, reinicia visor a 0
- `⌫` (backspace) a la derecha, elimina último dígito vía `Math.floor(prev / 10)`
  (antes `DESHACER` y `C` hacían lo mismo: clear completo)
- Leyenda expandida a 3 columnas: **TOTAL** | **ASIGNADO** | **SALDO**
  (antes solo TOTAL + SALDO; `asignado = importe - saldo`)
- Visor reducido de 56px → **42px** (−25%)
- Símbolo `$` integrado con el número sin gap, alineado a la derecha como una sola unidad
- `Calculadora.jsx` sin cambios — solo usado por `StepImporte`
