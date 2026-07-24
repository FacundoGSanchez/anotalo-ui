import { apiConfig } from "../config/apiConfig";
import { authClient } from "./authClient";
import type { PostRequest } from "../types/postRequest";

export const postClient = {
  async execute<TResponse = unknown>(request: PostRequest): Promise<TResponse> {
    if (!apiConfig.baseUrl) {
      throw new Error("[postClient] VITE_API_BASE_URL no configurada");
    }

    const res = await fetch(`${apiConfig.baseUrl}/api/handler/procesar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authClient.getAuthHeaders(),
      },
      body: JSON.stringify(request),
    });

    if (res.status === 401) {
      authClient.logout();
      window.location.href = "/login";
      throw new Error("Sesión expirada");
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ mensaje: res.statusText }));
      throw new Error(err.mensaje || `Error en comando [${request.pProceso}]`);
    }

    return res.json();
  },
};
