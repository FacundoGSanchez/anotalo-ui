import { hashPassword } from "@/utils/crypto";
import type { Usuario, UsuarioSucursal } from "@/types/user";

const STORAGE_KEY = "usuarios_db";

function getAll(): Usuario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Usuario[]) : [];
  } catch {
    return [];
  }
}

function getById(id: number): Usuario | null {
  return getAll().find((u) => u.id === id) || null;
}

function getByUsername(username: string): Usuario | null {
  return getAll().find((u) => u.username === username) || null;
}

interface CreateUsuarioInput {
  username: string;
  password: string;
  nombre: string;
  sucursales?: UsuarioSucursal[];
}

async function create({ username, password, nombre, sucursales = [] }: CreateUsuarioInput): Promise<Usuario | null> {
  const lista = getAll();
  if (lista.some((u) => u.username === username)) return null;
  const maxId = lista.reduce((max, u) => Math.max(max, u.id), 0);
  const hashedPassword = await hashPassword(password);
  const nuevo: Usuario = { id: maxId + 1, username: username.trim(), password: hashedPassword, nombre: nombre.trim(), sucursales };
  lista.push(nuevo);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  return nuevo;
}

async function update(id: number, data: Partial<Usuario>): Promise<Usuario | null> {
  const lista = getAll();
  const idx = lista.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  const existente = lista[idx];
  if (data.username && data.username !== existente.username && lista.some((u) => u.username === data.username)) return null;
  const updatedData: Record<string, unknown> = { ...data };
  if (updatedData.password) {
    updatedData.password = await hashPassword(updatedData.password as string);
  }
  lista[idx] = { ...existente, ...updatedData, id: existente.id } as Usuario;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  return lista[idx];
}

function deleteById(id: number): boolean {
  const lista = getAll();
  const nuevos = lista.filter((u) => u.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevos));
  return true;
}

function login(username: string, password: string): Usuario | null {
  const user = getAll().find((u) => u.username === username && u.password === password);
  return user || null;
}

export const usuarioService = { getAll, getById, getByUsername, create, update, deleteById, login };
