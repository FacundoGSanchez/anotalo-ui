import { hashPassword } from "../utils/crypto";

const STORAGE_KEY = "usuarios_db";

function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getById(id) {
  return getAll().find((u) => u.id === id) || null;
}

function getByUsername(username) {
  return getAll().find((u) => u.username === username) || null;
}

async function create({ username, password, nombre, sucursales = [] }) {
  const lista = getAll();
  if (lista.some((u) => u.username === username)) return null;
  const maxId = lista.reduce((max, u) => Math.max(max, u.id), 0);
  const hashedPassword = await hashPassword(password);
  const nuevo = { id: maxId + 1, username: username.trim(), password: hashedPassword, nombre: nombre.trim(), sucursales };
  lista.push(nuevo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  return nuevo;
}

async function update(id, data) {
  const lista = getAll();
  const idx = lista.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  const existente = lista[idx];
  if (data.username && data.username !== existente.username && lista.some((u) => u.username === data.username)) return null;
  const updatedData = { ...data };
  if (updatedData.password) {
    updatedData.password = await hashPassword(updatedData.password);
  }
  lista[idx] = { ...existente, ...updatedData, id: existente.id };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  return lista[idx];
}

function deleteById(id) {
  const lista = getAll();
  const nuevos = lista.filter((u) => u.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevos));
  return true;
}

function login(username, password) {
  const user = getAll().find((u) => u.username === username && u.password === password);
  return user || null;
}

export const usuarioService = { getAll, getById, getByUsername, create, update, deleteById, login };
