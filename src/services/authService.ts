import type { Session } from "@/types/user";
import type { Organizacion } from "@/types/organization";
import type { Usuario } from "@/types/user";
import type { FormaPagoItem } from "@/types/common";
import type { Rol } from "@/types/common";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const ORG_KEY = "current_org_id";
const SUCURSAL_KEY = "current_sucursal_id";

const API_BASE = import.meta.env.VITE_API_URL || "";

const MOCK_PASSWORD_HASH = "bcb9e0e70fc92ab35b072f642153627727dc224bd4a0ddb4334ddc2195e7a6d3";
const MOCK_PASSWORD_HASH_FALLBACK = "c2f07f20";

interface MockFormaPago {
  key: string;
  label: string;
  iconKey: string;
  enabled: boolean;
  impactaCaja: boolean;
  impactaCtaCte: boolean;
}

interface MockOrganizacion extends Organizacion {
  FormasPago: Record<string, MockFormaPago[]>;
  TiposMovimiento: string[];
}

interface MockUserData {
  usuario: {
    id: number;
    username: string;
    mail: string;
    nombre: string;
    rol: string;
    roles: number[];
  };
  sucursales: Array<{
    id: number;
    organizacionId: number;
    nombre: string;
  }>;
}

const BASE_ORG: MockOrganizacion = {
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

const SECOND_ORG: MockOrganizacion = {
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

const ALL_SUCURSALES: Array<{
  id: number;
  organizacionId: number;
  nombre: string;
}> = [
  { id: 1, organizacionId: 1, nombre: "Sucursal Centro" },
  { id: 2, organizacionId: 1, nombre: "Sucursal Norte" },
  { id: 3, organizacionId: 2, nombre: "Panadería Central" },
  { id: 4, organizacionId: 2, nombre: "Kiosco Norte" },
];

const ROLES_DATA: Rol[] = [
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

const MOCK_USERS: Record<string, MockUserData> = {
  admin: {
    usuario: { id: 1, username: "admin", mail: "admin@anotalo.com", nombre: "Admin", rol: "Admin", roles: [1] },
    sucursales: ALL_SUCURSALES,
  },
};

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const authService = {
  async login(username: string, password: string): Promise<Session> {
    const useMock = !API_BASE;
    if (useMock) {
      await new Promise((r) => setTimeout(r, 800));
      let userData: MockUserData | undefined = MOCK_USERS[username];
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
      const sucursalDefault = userData!.sucursales[0]?.id || 1;
      const session: Session = {
        token: "mock-jwt-token-anotalo-2024",
        sessionId: generateSessionId(),
        organizaciones: [BASE_ORG, SECOND_ORG],
        rolesData: ROLES_DATA,
        usuario: userData!.usuario as Usuario,
        sucursales: userData!.sucursales,
      };
      localStorage.setItem(TOKEN_KEY, session.token);
      localStorage.setItem(USER_KEY, JSON.stringify(session));

      const orgActual = BASE_ORG;
      const { orgService } = await import("./orgService");
      const configPayload: Record<string, unknown> = {};
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

  getCurrentOrgId(): number | null {
    const raw = localStorage.getItem(ORG_KEY);
    return raw ? Number(raw) : null;
  },

  async switchOrganization(orgId: number): Promise<Organizacion | null> {
    const session = this.getSession();
    if (!session) return null;
    const org = session.organizaciones?.find((o) => o.id === orgId);
    if (!org) return null;
    localStorage.setItem(ORG_KEY, String(orgId));
    localStorage.removeItem(SUCURSAL_KEY);
    const { orgService } = await import("./orgService");
    const configPayload: Record<string, unknown> = {};
    if ((org as MockOrganizacion).FormasPago) configPayload.formasPago = (org as MockOrganizacion).FormasPago;
    if ((org as MockOrganizacion).TiposMovimiento) configPayload.tiposMovimiento = (org as MockOrganizacion).TiposMovimiento;
    if (Object.keys(configPayload).length > 0) {
      orgService.initOrgConfig(orgId, configPayload);
    }
    window.dispatchEvent(new Event("org-changed"));
    return org;
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ORG_KEY);
    localStorage.removeItem(SUCURSAL_KEY);

    const appPrefixes = ["org_config_"];
    const appKeys: string[] = [];
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (appPrefixes.some((p) => key.startsWith(p)) || appKeys.includes(key)) {
        toRemove.push(key);
      }
    }
    toRemove.forEach((key) => localStorage.removeItem(key));
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
    return !!this.getToken() && !!this.getSession();
  },

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  getCurrentSucursalId(): number | null {
    const raw = localStorage.getItem(SUCURSAL_KEY);
    return raw ? Number(raw) : null;
  },

  switchSucursal(sucursalId: number): void {
    localStorage.setItem(SUCURSAL_KEY, String(sucursalId));
    window.dispatchEvent(new Event("sucursal-changed"));
  },
};
