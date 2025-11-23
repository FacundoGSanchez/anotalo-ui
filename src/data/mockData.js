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

// 🔥 Mock de productos
export const mockProducts = [
  {
    id: 1,
    detalle: "Chomba Escolar Blanca Talle 6",
    codigo: "RE001",
    precio: 7500,
    stock: 18,
  },
  {
    id: 2,
    detalle: "Chomba Escolar Blanca Talle 8",
    codigo: "RE002",
    precio: 7800,
    stock: 12,
  },
  {
    id: 3,
    detalle: "Chomba Escolar Blanca Talle 10",
    codigo: "RE003",
    precio: 8200,
    stock: 10,
  },

  {
    id: 4,
    detalle: "Pantalón Jogging Azul Talle 6",
    codigo: "RE010",
    precio: 10500,
    stock: 20,
  },
  {
    id: 5,
    detalle: "Pantalón Jogging Azul Talle 8",
    codigo: "RE011",
    precio: 10900,
    stock: 16,
  },
  {
    id: 6,
    detalle: "Pantalón Jogging Azul Talle 10",
    codigo: "RE012",
    precio: 11200,
    stock: 14,
  },

  {
    id: 7,
    detalle: "Buzo Friza Azul Talle 6",
    codigo: "RE020",
    precio: 13500,
    stock: 9,
  },
  {
    id: 8,
    detalle: "Buzo Friza Azul Talle 8",
    codigo: "RE021",
    precio: 13900,
    stock: 11,
  },
  {
    id: 9,
    detalle: "Buzo Friza Azul Talle 10",
    codigo: "RE022",
    precio: 14500,
    stock: 7,
  },

  {
    id: 10,
    detalle: "Guardapolvo Blanco Talle 6",
    codigo: "RE030",
    precio: 16500,
    stock: 5,
  },
  {
    id: 11,
    detalle: "Guardapolvo Blanco Talle 8",
    codigo: "RE031",
    precio: 17500,
    stock: 8,
  },
  {
    id: 12,
    detalle: "Guardapolvo Blanco Talle 10",
    codigo: "RE032",
    precio: 18500,
    stock: 6,
  },

  {
    id: 13,
    detalle: "Remera Manga Corta Blanca Talle 6",
    codigo: "RE040",
    precio: 6500,
    stock: 22,
  },
  {
    id: 14,
    detalle: "Remera Manga Corta Blanca Talle 8",
    codigo: "RE041",
    precio: 6800,
    stock: 20,
  },
  {
    id: 15,
    detalle: "Remera Manga Corta Blanca Talle 10",
    codigo: "RE042",
    precio: 7200,
    stock: 15,
  },
];

// 🔥 Columnas dinámicas
export const productColumns = [
  {
    title: "Detalle",
    dataIndex: "detalle",
    width: 220,
    ellipsis: true,
  },
  {
    title: "Código",
    dataIndex: "codigo",
    width: 100,
  },
  {
    title: "Precio",
    dataIndex: "precio",
    align: "right",
    width: 100,
    render: (value) => `$ ${value.toLocaleString("es-AR")}`,
  },
  {
    title: "Stock",
    dataIndex: "stock",
    align: "center",
    width: 80,
  },
];
