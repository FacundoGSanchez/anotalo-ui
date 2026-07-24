import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface DeviceContextValue {
  isMobile: boolean;
  isDesktop: boolean;
}

export const DeviceContext = createContext<DeviceContextValue | undefined>(undefined);

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const checkIsMobile = (): boolean => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  };

  const [isMobile, setIsMobile] = useState(checkIsMobile());
  const [isDesktop, setIsDesktop] = useState(!checkIsMobile());

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsDesktop(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DeviceContext.Provider value={{ isMobile, isDesktop }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = (): DeviceContextValue => {
  const context = useContext(DeviceContext);
  if (!context) throw new Error("useDevice debe usarse dentro de DeviceProvider");
  return context;
};
