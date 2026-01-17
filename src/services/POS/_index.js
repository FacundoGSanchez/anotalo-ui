// services/pos/POS.js

import { calculateResumen } from "./calculations";
import { loadCarrito, saveCarrito } from "./storage";

export const POSService = {
  loadCarrito() {
    return loadCarrito();
  },

  addItem(carrito, articulo) {
    const nuevo = {
      ...articulo,
      cantidad: 1,
      difPeso: 0,
      difPorcentaje: 0,
      subtotal: articulo.precio,
    };

    const updated = [...carrito, nuevo];
    saveCarrito(updated);
    return updated;
  },

  removeItem(carrito, id) {
    const updated = carrito.filter((i) => i.id !== id);
    saveCarrito(updated);
    return updated;
  },

  updateItem(carrito, id, values) {
    const updated = carrito.map((item) =>
      item.id === id ? { ...item, ...values } : item
    );

    saveCarrito(updated);
    return updated;
  },

  getResumen(carrito) {
    return calculateResumen(carrito);
  },
};
