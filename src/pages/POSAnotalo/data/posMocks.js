export const MOCK_ENTIDADES = {
  CLIENTES: [
    { id: 1, nombre: "Juan Pérez", saldo: -1500 },
    { id: 2, nombre: "Empresa S.A.", saldo: 0 },
    { id: 3, nombre: "María García", saldo: 2500 },
  ],
  PROVEEDORES: [
    { id: 11, nombre: "Distribuidora Arcor", cuit: "30-12345678-9" },
    { id: 12, nombre: "Papelera Sur", cuit: "30-98765432-1" },
    { id: 13, nombre: "Fiambrería El Galpón", cuit: "20-11222333-4" },
  ],
  PREDETERMINADOS: {
    CLIENTE: { id: 0, nombre: "Consumidor Final" },
    PROVEEDOR: { id: 10, nombre: "Proveedor General" },
  },
};
