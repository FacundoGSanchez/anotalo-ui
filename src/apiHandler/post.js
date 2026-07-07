import { auth_api } from "./auth_api";

const API_BASE = import.meta.env.VITE_API_URL;

export async function post(proceso, jsonParam = {}) {
  if (!API_BASE) throw new Error("[apiHandler/post] VITE_API_URL no configurada");

  const headers = {
    "Content-Type": "application/json",
    ...auth_api.getAuthHeaders(),
  };

  const res = await fetch(`${API_BASE}/api/command`, {
    method: "POST",
    headers,
    body: JSON.stringify({ nombreProceso: proceso, jsonParam }),
  });

  if (res.status === 401) {
    auth_api.logout();
    window.location.href = "/login";
    throw new Error("Sesión expirada");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ mensaje: res.statusText }));
    throw new Error(err.mensaje || `Error en comando [${proceso}]`);
  }

  return res.json();
}
