import React, { createContext, useState, useContext } from "react";

// 1. Crea el Contexto
export const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// 2. Crea el Proveedor del Contexto
export const AuthProvider = ({ children }) => {
  // Estado que manejará si el usuario está logueado o no
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para iniciar sesión (solo cambia el estado a true por ahora)
  const login = () => {
    setIsAuthenticated(true);
  };

  // Función para cerrar sesión (si la necesitarás en el futuro)
  const logout = () => {
    setIsAuthenticated(false);
  };

  const contextValue = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};
