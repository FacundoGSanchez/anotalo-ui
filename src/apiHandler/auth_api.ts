import type { Session } from "@/types/user";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const API_BASE = import.meta.env.VITE_API_URL;

export const auth_api = {
  async login(username: string, password: string): Promise<Session> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Error al conectar con el servidor.");
    }
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getSession(): Session | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as Session) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
