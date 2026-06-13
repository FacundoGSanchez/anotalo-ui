# SDD - POS Anotalo

## Especificación del Módulo POS (Punto de Venta)

**Versión:** 0.2
**Fecha:** 10/06/2026
**Propósito:** Punto de entrada a las especificaciones del módulo POS. El módulo se divide en dos variantes según el dispositivo.

---

## Variantes

| Variante | Archivo | Descripción |
|----------|---------|-------------|
| **Desktop** | `spec_PosAnotaloDesktop.md` | Punto de Venta Full con layout de 3 zonas, soporte para lectora de código de barras y teclado físico |
| **Mobile** | `spec_PosAnotaloMobile.md` | Wizard táctil minimalista de 5 pasos optimizado para pantallas pequeñas sin lectora de barras |

---

## Router

`POSAnotalo.jsx` actúa como router: consulta `useDevice().isDesktop` y renderiza el componente correspondiente (`POSAnotaloDesktop` o `POSAnotaloMobile`).

---

## Archivos compartidos

Ambas variantes comparten los siguientes archivos:

| Archivo | Rol |
|---------|-----|
| `src/pages/POSAnotalo/POSAnotalo.jsx` | Router mobile/desktop según DeviceContext |
| `src/pages/POSAnotalo/components/PosHeader.jsx` | Header del POS |
| `src/pages/POSAnotalo/components/steps/StepTipo.jsx` | Paso selección tipo |
| `src/pages/POSAnotalo/components/steps/StepImporte.jsx` | Paso ingreso de múltiples importes |
| `src/pages/POSAnotalo/components/steps/StepFormaPago.jsx` | Paso forma de pago |
| `src/pages/POSAnotalo/components/steps/StepEntidad.jsx` | Paso selección entidad |
| `src/pages/POSAnotalo/components/steps/StepConfirmar.jsx` | Paso confirmación |
| `src/pages/POSAnotalo/components/steps/components/Calculadora.jsx` | Teclado numérico |
| `src/pages/POSAnotalo/components/steps/components/SelectorEntidadModal.jsx` | Modal entidades |
| `src/pages/POSAnotalo/hooks/usePosFlow.js` | Hook del flujo |
| `src/constants/posConstants.jsx` | Constantes del POS |
| `src/services/orgService.js` | Servicio de config por organización |
| `src/pages/FormasPagoConfig/FormasPagoConfigPage.jsx` | Configuración visual de formas de pago |
| `sdd/spec_config.md` | Configuración por organización |
