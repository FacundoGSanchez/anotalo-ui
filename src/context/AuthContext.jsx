import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const MOCK_USER_DATA = {
  username: "admin",
  mail: "admin@anotalo.com",
  rol: "ADMIN_ROOT",
  organizacionDefault: "Org Principal",
  sucursalDefault: "Sucursal Centro",
  rolesXUser: ["ADMIN", "EDITOR"],
  organizacionesXUser: ["Org Principal", "Org Secundaria"],
  sucursalesXUser: ["Sucursal Centro", "Sucursal Norte", "Sucursal Sur"],
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Validación simple de integridad
        if (parsedUser?.username && parsedUser?.rol) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // 1. Limpiar el estado de React (AuthContext)
    setUser(null);
    setIsAuthenticated(false);

    // 2. Limpiar el almacenamiento persistente
    localStorage.removeItem("user");
    // Si usas tokens, también: localStorage.removeItem("token");

    // 4. Redireccionar al Login
    navigate("/login");
  };
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Exportación fundamental para CardUser y Login
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
