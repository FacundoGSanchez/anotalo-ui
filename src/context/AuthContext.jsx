import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
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

  const login = useCallback(async (username, password) => {
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

  const switchOrganization = useCallback(async (orgId) => {
    const org = await authService.switchOrganization(orgId);
    if (org) {
      const stored = authService.getSession();
      setSession(stored);
      setUser(stored?.usuario);
    }
    return org;
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, session, login, logout, getToken, loading, switchOrganization }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
