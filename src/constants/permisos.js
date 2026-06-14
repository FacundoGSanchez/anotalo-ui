export const MODULOS = {
  DASHBOARD: "DASHBOARD",
  POS: "POS",
  MOVIMIENTOS: "MOVIMIENTOS",
  ENTIDADES: "ENTIDADES",
  GESTIONES: "GESTIONES",
  REPORTES: "REPORTES",
  CONFIG: "CONFIG",
};

export const ACCIONES = {
  LEER: "leer",
  CREAR: "crear",
  EDITAR: "editar",
  ELIMINAR: "eliminar",
};

export const ROLES = [
  {
    id: 1,
    nombre: "ADMIN",
    permisos: [
      { modulo: "*", formulario: "*", acciones: ["*"] },
    ],
  },
  {
    id: 2,
    nombre: "VENDEDOR",
    permisos: [
      { modulo: MODULOS.POS, formulario: "*", acciones: ["*"] },
      { modulo: MODULOS.MOVIMIENTOS, formulario: "listado", acciones: [ACCIONES.LEER] },
      { modulo: MODULOS.GESTIONES, formulario: "caja", acciones: ["*"] },
      { modulo: MODULOS.ENTIDADES, formulario: "*", acciones: [ACCIONES.LEER] },
    ],
  },
  {
    id: 3,
    nombre: "RESPONSABLE_SUCURSAL",
    permisos: [
      { modulo: "*", formulario: "*", acciones: [ACCIONES.LEER] },
      { modulo: MODULOS.POS, formulario: "*", acciones: ["*"] },
      { modulo: MODULOS.CONFIG, formulario: "*", acciones: ["*"] },
      { modulo: MODULOS.REPORTES, formulario: "*", acciones: ["*"] },
    ],
  },
];
