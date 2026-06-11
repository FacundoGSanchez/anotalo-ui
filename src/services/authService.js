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
    {
      id: 1,
      nombre: "Org Principal",
      sucursalDefault: 1,
      FormasPago: {
        Venta: [
          { key: "Efectivo", label: "Efectivo", iconKey: "Efectivo", enabled: true, impactaCaja: true, impactaCtaCte: false },
          { key: "Transferencia", label: "Transferencia", iconKey: "Transferencia", enabled: true, impactaCaja: false, impactaCtaCte: false },
          { key: "Cta Corriente", label: "Cuenta Corriente", iconKey: "CtaCorriente", enabled: true, impactaCaja: false, impactaCtaCte: true },
          { key: "Tarjeta", label: "Tarjetas", iconKey: "TarjetaCredito", enabled: true, impactaCaja: false, impactaCtaCte: false },
          { key: "QR", label: "QR", iconKey: "QR", enabled: true, impactaCaja: false, impactaCtaCte: false },
        ],
        Pago: [
          { key: "Efectivo", label: "Efectivo", iconKey: "Efectivo", enabled: true, impactaCaja: true, impactaCtaCte: false },
          { key: "Transferencia", label: "Transferencia", iconKey: "Transferencia", enabled: true, impactaCaja: false, impactaCtaCte: false },
          { key: "Tarjeta", label: "Tarjetas", iconKey: "TarjetaCredito", enabled: true, impactaCaja: false, impactaCtaCte: false },
          { key: "QR", label: "QR", iconKey: "QR", enabled: true, impactaCaja: false, impactaCtaCte: false },
        ],
        Cobro: [
          { key: "Efectivo", label: "Efectivo", iconKey: "Efectivo", enabled: true, impactaCaja: true, impactaCtaCte: false },
          { key: "Transferencia", label: "Transferencia", iconKey: "Transferencia", enabled: true, impactaCaja: false, impactaCtaCte: false },
          { key: "Tarjeta", label: "Tarjetas", iconKey: "TarjetaCredito", enabled: true, impactaCaja: false, impactaCtaCte: false },
          { key: "QR", label: "QR", iconKey: "QR", enabled: true, impactaCaja: false, impactaCtaCte: false },
        ],
      },
      TiposMovimiento: ["Venta", "Pago", "Cobro"],
    },
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

const ORG_KEY = "current_org_id";

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

      // Limpiar datos de prueba anteriores para el MVP
      localStorage.removeItem("movimientos_db");

      // Inicializar config de la primera org
      const orgActual = session.organizaciones?.[0];
      if (orgActual) {
        const { orgService } = await import("./orgService");
        const configPayload = {};
        if (orgActual.FormasPago) configPayload.formasPago = orgActual.FormasPago;
        if (orgActual.TiposMovimiento) configPayload.tiposMovimiento = orgActual.TiposMovimiento;
        if (Object.keys(configPayload).length > 0) {
          orgService.initOrgConfig(orgActual.id, configPayload);
        }
      }
      localStorage.setItem(ORG_KEY, String(orgActual?.id || ""));

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

  getCurrentOrgId() {
    const raw = localStorage.getItem(ORG_KEY);
    return raw ? Number(raw) : null;
  },

  async switchOrganization(orgId) {
    const session = this.getSession();
    if (!session) return null;
    const org = session.organizaciones?.find((o) => o.id === orgId);
    if (!org) return null;
    localStorage.setItem(ORG_KEY, String(orgId));
    const { orgService } = await import("./orgService");
    const configPayload = {};
    if (org.FormasPago) configPayload.formasPago = org.FormasPago;
    if (org.TiposMovimiento) configPayload.tiposMovimiento = org.TiposMovimiento;
    if (Object.keys(configPayload).length > 0) {
      orgService.initOrgConfig(orgId, configPayload);
    }
    window.dispatchEvent(new Event("org-changed"));
    return org;
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
