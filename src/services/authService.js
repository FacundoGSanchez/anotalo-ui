const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const API_BASE = import.meta.env.VITE_API_URL || "";

const MOCK_PASSWORD_HASH = "bcb9e0e70fc92ab35b072f642153627727dc224bd4a0ddb4334ddc2195e7a6d3";
const MOCK_PASSWORD_HASH_FALLBACK = "c2f07f20";

const BASE_ORG = {
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
};

const SECOND_ORG = {
  id: 2,
  nombre: "Mi Negocio",
  sucursalDefault: 3,
  FormasPago: {
    Venta: [
      { key: "Efectivo", label: "Efectivo", iconKey: "Efectivo", enabled: true, impactaCaja: true, impactaCtaCte: false },
      { key: "Transferencia", label: "Transferencia", iconKey: "Transferencia", enabled: true, impactaCaja: false, impactaCtaCte: false },
      { key: "QR", label: "QR", iconKey: "QR", enabled: true, impactaCaja: false, impactaCtaCte: false },
    ],
    Pago: [
      { key: "Efectivo", label: "Efectivo", iconKey: "Efectivo", enabled: true, impactaCaja: true, impactaCtaCte: false },
      { key: "Transferencia", label: "Transferencia", iconKey: "Transferencia", enabled: true, impactaCaja: false, impactaCtaCte: false },
    ],
    Cobro: [
      { key: "Efectivo", label: "Efectivo", iconKey: "Efectivo", enabled: true, impactaCaja: true, impactaCtaCte: false },
      { key: "Transferencia", label: "Transferencia", iconKey: "Transferencia", enabled: true, impactaCaja: false, impactaCtaCte: false },
    ],
  },
  TiposMovimiento: ["Venta", "Pago", "Cobro"],
};

const ALL_SUCURSALES = [
  { id: 1, organizacionId: 1, nombre: "Sucursal Centro" },
  { id: 2, organizacionId: 1, nombre: "Sucursal Norte" },
  { id: 3, organizacionId: 2, nombre: "Panadería Central" },
  { id: 4, organizacionId: 2, nombre: "Kiosco Norte" },
];

const ROLES_DATA = [
  {
    id: 1,
    nombre: "ADMIN",
    permisos: [
      { modulo: "*", formulario: "*", acciones: ["*"] },
    ],
  },
  {
    id: 2,
    nombre: "VENDEDOR",
    permisos: [
      { modulo: "POS", formulario: "*", acciones: ["*"] },
      { modulo: "MOVIMIENTOS", formulario: "listado", acciones: ["leer"] },
      { modulo: "GESTIONES", formulario: "caja", acciones: ["*"] },
      { modulo: "ENTIDADES", formulario: "*", acciones: ["leer"] },
    ],
  },
  {
    id: 3,
    nombre: "RESPONSABLE_SUCURSAL",
    permisos: [
      { modulo: "*", formulario: "*", acciones: ["leer"] },
      { modulo: "POS", formulario: "*", acciones: ["*"] },
      { modulo: "CONFIG", formulario: "*", acciones: ["*"] },
      { modulo: "REPORTES", formulario: "*", acciones: ["*"] },
    ],
  },
];

const MOCK_USERS = {
  admin: {
    usuario: { id: 1, username: "admin", mail: "admin@anotalo.com", nombre: "Admin", rol: "Admin", roles: [1] },
    sucursales: ALL_SUCURSALES,
  },
};

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const ORG_KEY = "current_org_id";
const SUCURSAL_KEY = "current_sucursal_id";

export const authService = {
  async login(username, password) {
    const useMock = !API_BASE;
    if (useMock) {
      await new Promise((r) => setTimeout(r, 800));
      let userData = MOCK_USERS[username];
      if (!userData) {
        const { usuarioService } = await import("./usuarioService");
        const usuario = usuarioService.login(username, password);
        if (!usuario) throw new Error("Usuario o contraseña incorrectos.");
        userData = {
          usuario: { id: usuario.id, username: usuario.username, mail: "", nombre: usuario.nombre, rol: "Vendedor", roles: [2] },
          sucursales: (usuario.sucursales || []).map((s) => ({ ...s, organizacionId: BASE_ORG.id })),
        };
      } else if (password !== MOCK_PASSWORD_HASH && password !== MOCK_PASSWORD_HASH_FALLBACK) {
        throw new Error("Usuario o contraseña incorrectos.");
      }
      const sucursalDefault = userData.sucursales[0]?.id || 1;
      const session = {
        token: "mock-jwt-token-anotalo-2024",
        sessionId: generateSessionId(),
        organizaciones: [BASE_ORG, SECOND_ORG],
        rolesData: ROLES_DATA,
        usuario: userData.usuario,
        sucursales: userData.sucursales,
      };
      localStorage.setItem(TOKEN_KEY, session.token);
      localStorage.setItem(USER_KEY, JSON.stringify(session));

      const orgActual = BASE_ORG;
      const { orgService } = await import("./orgService");
      const configPayload = {};
      if (orgActual.TiposMovimiento) configPayload.tiposMovimiento = orgActual.TiposMovimiento;
      if (Object.keys(configPayload).length > 0) {
        orgService.initOrgConfig(orgActual.id, configPayload);
      }
      localStorage.setItem(ORG_KEY, String(orgActual.id));
      localStorage.setItem(SUCURSAL_KEY, String(sucursalDefault));

      return session;
    }
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Error al conectar con el servidor.");
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
    localStorage.removeItem(SUCURSAL_KEY);
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
    localStorage.removeItem(ORG_KEY);
    localStorage.removeItem(SUCURSAL_KEY);

    const appPrefixes = ["org_config_"];
    const appKeys = [];
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (appPrefixes.some((p) => key.startsWith(p)) || appKeys.includes(key)) {
        toRemove.push(key);
      }
    }
    toRemove.forEach((key) => localStorage.removeItem(key));
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

  getCurrentSucursalId() {
    const raw = localStorage.getItem(SUCURSAL_KEY);
    return raw ? Number(raw) : null;
  },

  switchSucursal(sucursalId) {
    localStorage.setItem(SUCURSAL_KEY, String(sucursalId));
    window.dispatchEvent(new Event("sucursal-changed"));
  },
};
