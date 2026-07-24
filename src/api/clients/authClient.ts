import { apiConfig } from "../config/apiConfig";
import type { AuthRequest } from "../types/authRequest";
import type { AuthResponse } from "../types/authResponse";

const TOKEN_KEY = "auth_token";

export const authClient = {
  async login(request: AuthRequest): Promise<AuthResponse> {
    const res = await fetch(`${apiConfig.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error al conectar con el servidor.");
    }

    const data: AuthResponse = await res.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};
