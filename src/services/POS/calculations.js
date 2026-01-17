// services/pos/calculations.js

export const calculateResumen = (carrito) => {
  const itemsCount = carrito.length;

  const subtotal = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return {
    itemsCount,
    subtotal,
    descuentos: 0,
    recargo: 0,
    total: subtotal,
  };
};
