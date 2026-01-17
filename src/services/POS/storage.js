// services/pos/storage.js

const KEY = "carrito";

export const loadCarrito = () => {
  const saved = localStorage.getItem(KEY);
  return saved ? JSON.parse(saved) : [];
};

export const saveCarrito = (carrito) => {
  localStorage.setItem(KEY, JSON.stringify(carrito));
};
