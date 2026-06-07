const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const API_BASE = import.meta.env.VITE_API_URL || "";

const MOCK_CREDENTIALS = {
  username: "admin",
  password: "adminanotalo",
};

const MOCK_RESPONSE = {
  usuario: {
    id: 1,
    username: "admin",
    mail: "admin@anotalo.com",
    nombre: "Admin",
    rol: "ADMIN_ROOT",
  },
  token: "mock-jwt-token-anotalo-2024",
  organizaciones: [
    { id: 1, nombre: "Org Principal", sucursalDefault: 1 },
    { id: 2, nombre: "Org Secundaria", sucursalDefault: null },
  ],
  sucursales: [
    { id: 1, organizacionId: 1, nombre: "Sucursal Centro" },
    { id: 2, organizacionId: 1, nombre: "Sucursal Norte" },
    { id: 3, organizacionId: 1, nombre: "Sucursal Sur" },
  ],
  roles: ["ADMIN_ROOT", "ADMIN"],
};

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const authService = {
  async login(username, password) {
    const useMock = !API_BASE;
    if (useMock) {
      await new Promise((r) => setTimeout(r, 800));
      if (username !== MOCK_CREDENTIALS.username || password !== MOCK_CREDENTIALS.password) {
        throw new Error("Credenciales incorrectas.");
      }
      const session = { ...MOCK_RESPONSE, sessionId: generateSessionId() };
      localStorage.setItem(TOKEN_KEY, session.token);
      localStorage.setItem(USER_KEY, JSON.stringify(session));
      return session;
    }
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Error de autenticación");
    const data = await res.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getSession() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getToken() && !!this.getSession();
  },

  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
