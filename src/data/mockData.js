export const MOCK_CARRITO_INICIAL = [
  {
    key: "1",
    detalle: "Pantalon Algodon Verano | Talle 12",
    codigo: "X732049",
    precio: 1540.0,
    dif: -150.24, // Diferencia: Descuento (negativo) o Recargo (positivo)
    cant: 2,
    subtotal: 3080.0,
  },
  {
    key: "2",
    detalle: "Buzo Algodon Azul | Talle 12",
    codigo: "X881023",
    precio: 1540.0,
    dif: 2568.45,
    cant: 2,
    subtotal: 3080.0,
  },
];

export const MOCK_MAESTRO_VENTA = [
  ...MOCK_CARRITO_INICIAL,
  {
    key: "3",
    detalle: "Remera Algodon | Talle 10",
    codigo: "X945678",
    precio: 1540.0,
    dif: 125.4,
    cant: 1,
    subtotal: 1540.0,
  },
  {
    key: "4",
    detalle: "Camisa Lino Blanca | Talle M",
    codigo: "C112345",
    precio: 2500.0,
    dif: 0.0,
    cant: 1,
    subtotal: 2500.0,
  },
  {
    key: "5",
    detalle: "Zapatillas Urbanas Negras",
    codigo: "Z098765",
    precio: 8000.0,
    dif: 0.0,
    cant: 1,
    subtotal: 8000.0,
  },
];

export const FIJOS_RESUMEN = {
  descuentos: 2500.85, // Descuento aplicado al total (no por artículo)
  recargo: 2500.85, // Recargo aplicado al total (no por artículo)
};
