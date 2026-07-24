import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import type { Session, Usuario } from "@/types/user";
import type { Organizacion } from "@/types/organization";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: Usuario | null;
  session: Session | null;
  login: (username: string, password: string) => Promise<Session>;
  logout: () => void;
  getToken: () => string | null;
  loading: boolean;
  switchOrganization: (orgId: number) => Promise<Organizacion | null>;
  can: (modulo: string, formulario: string, accion?: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = authService.getSession();
    if (stored && authService.isAuthenticated()) {
      setSession(stored);
      setUser(stored.usuario);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<Session> => {
    const data = await authService.login(username, password);
    setSession(data);
    setUser(data.usuario);
    setIsAuthenticated(true);
    return data;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
    authService.logout();
    navigate("/login");
  }, [navigate]);

  const getToken = useCallback(() => authService.getToken(), []);

  const switchOrganization = useCallback(async (orgId: number): Promise<Organizacion | null> => {
    const org = await authService.switchOrganization(orgId);
    if (org) {
      const stored = authService.getSession();
      setSession(stored);
      setUser(stored?.usuario ?? null);
    }
    return org;
  }, []);

  const can = useCallback((modulo: string, formulario: string, accion: string = "leer"): boolean => {
    if (!session?.rolesData || !user?.roles?.length) return false;
    const userRoleIds = user.roles;
    const matchingPermisos = session.rolesData
      .filter((r) => userRoleIds.includes(r.id))
      .flatMap((r) => r.permisos);
    return matchingPermisos.some(
      (p) =>
        (p.modulo === "*" || p.modulo === modulo) &&
        (p.formulario === "*" || p.formulario === formulario) &&
        (p.acciones.includes("*") || p.acciones.includes(accion)),
    );
  }, [session, user]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, session, login, logout, getToken, loading, switchOrganization, can }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
