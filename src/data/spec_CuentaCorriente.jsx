// spec_CuentaCorriente.jsx
// Especificación del módulo Cuenta Corriente

export const CTA_CTE_SPEC = {
  habilitadoPor: "ctaCteConfig.habilitado",
  rango: {
    saldo: "calculado desde movimientos con formaPago === 'Cta Corriente'",
    alertas: {
      sobreLimite: "Math.abs(saldo) > ctaCteConfig.importeMaximo",
      plazoVencido: "días desde primer movimiento Cta Cte > ctaCteConfig.plazoDias",
    },
  },
  entidadForm: {
    fields: [
      { name: "nombre", label: "Denominación / Nombre", type: "text", required: true },
      { name: "telefono", label: "Teléfono de Contacto", type: "tel" },
      { name: "ctaCteConfig.habilitado", label: "Cuenta Corriente", type: "switch" },
      { name: "ctaCteConfig.importeMaximo", label: "Tope CuentaCorriente", type: "currency" },
      { name: "ctaCteConfig.plazoDias", label: "Plazo (días)", type: "number", legend: "Sobre primer compra" },
    ],
    acciones: {
      save: "Guardar Cliente/Proveedor",
      delete: "solo desde el listado (Popconfirm en fila)",
    },
  },
  reporte: {
    filtro: "entidades activas con ctaCteConfig.habilitado === true",
    columnas: ["nombre", "debe", "haber", "saldo"],
    alertas: ["sobreLimite", "plazoVencido"],
    detalle: {
      route: "/reportes/ctacte/:tipo/:id",
      muestra: "movimientos Cta Corriente de la entidad",
    },
  },
  listadoEntidades: {
    columnas: ["nombre", "telefono"],
    ctaCteTag: "mostrado en fila con color #eb2f96 (CTA CTE)",
    alertasFila: "icono MdWarning si sobreLimite o plazoVencido",
    deleteFila: "MdDeleteOutline + Popconfirm → entidadService.softDelete()",
  },
};
