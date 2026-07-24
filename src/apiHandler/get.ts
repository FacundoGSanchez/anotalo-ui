import { auth_api } from "./auth_api";

const API_BASE = import.meta.env.VITE_API_URL;

export async function get<T = unknown>(proceso: string, jsonParam: Record<string, unknown> = {}): Promise<T> {
  if (!API_BASE) throw new Error("[apiHandler/get] VITE_API_URL no configurada");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...auth_api.getAuthHeaders(),
  };

  const res = await fetch(`${API_BASE}/api/query`, {
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
    throw new Error(err.mensaje || `Error en consulta [${proceso}]`);
  }

  return res.json();
}
