import { createContext, useContext, useEffect, useState } from "react";

export const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const checkIsMobile = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false; // Valor por defecto para SSR si aplica
  };

  // 2. INICIALIZAMOS EL ESTADO CON EL VALOR REAL AL CARGAR
  // En lugar de (false), usamos el resultado de la función.
  const [isMobile, setIsMobile] = useState(checkIsMobile());
  const [isDesktop, setIsDesktop] = useState(!checkIsMobile());

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsDesktop(!mobile);
    };

    // Ya no es necesario llamar a handleResize() aquí porque
    // el estado inicial ya es correcto.
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DeviceContext.Provider value={{ isMobile, isDesktop }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
