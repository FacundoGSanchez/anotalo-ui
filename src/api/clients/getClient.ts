import { apiConfig } from "../config/apiConfig";
import { authClient } from "./authClient";
import type { GetRequest } from "../types/getRequest";

export const getClient = {
  async execute<TResponse = unknown>(request: GetRequest): Promise<TResponse> {
    if (!apiConfig.baseUrl) {
      throw new Error("[getClient] VITE_API_BASE_URL no configurada");
    }

    const params = new URLSearchParams({
      request: JSON.stringify(request),
    });

    const res = await fetch(`${apiConfig.baseUrl}/api/handler/consultar?${params.toString()}`, {
      method: "GET",
      headers: {
        ...authClient.getAuthHeaders(),
      },
    });

    if (res.status === 401) {
      authClient.logout();
      window.location.href = "/login";
      throw new Error("Sesión expirada");
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ mensaje: res.statusText }));
      throw new Error(err.mensaje || `Error en consulta [${request.pProceso}]`);
    }

    return res.json();
  },
};
