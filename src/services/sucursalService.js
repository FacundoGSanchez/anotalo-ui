const STORAGE_KEY = "sucursales_db";

const SUCURSALES_DEFAULT = [
  { id: 1, organizacionId: 1, nombre: "Sucursal Centro" },
  { id: 2, organizacionId: 1, nombre: "Sucursal Norte" },
];

function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SUCURSALES_DEFAULT));
    return SUCURSALES_DEFAULT;
  } catch {
    return [];
  }
}

function getById(id) {
  return getAll().find((s) => s.id === id) || null;
}

function create({ nombre }) {
  const lista = getAll();
  const maxId = lista.reduce((max, s) => Math.max(max, s.id), 0);
  const nueva = { id: maxId + 1, organizacionId: 1, nombre: nombre.trim() };
  lista.push(nueva);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  return nueva;
}

function update(id, { nombre }) {
  const lista = getAll();
  const idx = lista.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  lista[idx] = { ...lista[idx], nombre: nombre.trim() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  return lista[idx];
}

function deleteById(id) {
  const lista = getAll();
  if (lista.length <= 1) return false;
  const nuevos = lista.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevos));
  return true;
}

export const sucursalService = { getAll, getById, create, update, deleteById };
