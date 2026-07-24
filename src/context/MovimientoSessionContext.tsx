import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import { Modal } from "antd";

interface PendingNavigation {
  destination: string;
  navigateFn: (dest: string) => void;
}

interface MovimientoSessionContextValue {
  hasActiveItems: boolean;
  itemsCount: number;
  startMovement: () => void;
  updateItems: (count: number) => void;
  endMovement: () => void;
  confirmExit: (destination: string, navigateFn: (dest: string) => void) => void;
}

const MovimientoSessionContext = createContext<MovimientoSessionContextValue | undefined>(undefined);

export const MovimientoSessionProvider = ({ children }: { children: ReactNode }) => {
  const [itemsCount, setItemsCount] = useState(0);
  const pendingNavigation = useRef<PendingNavigation | null>(null);

  const hasActiveItems = itemsCount > 0;

  const startMovement = useCallback(() => {
    setItemsCount(0);
  }, []);

  const updateItems = useCallback((count: number) => {
    setItemsCount(count);
  }, []);

  const endMovement = useCallback(() => {
    setItemsCount(0);
    pendingNavigation.current = null;
  }, []);

  const confirmExit = useCallback((destination: string, navigateFn: (dest: string) => void) => {
    if (itemsCount === 0) {
      navigateFn(destination);
      return;
    }
    pendingNavigation.current = { destination, navigateFn };
    Modal.confirm({
      title: "¿Salir del POS?",
      content: "Tenés una venta en curso con " + itemsCount + " " + (itemsCount === 1 ? "item" : "items") + " cargados. Se perderán si salís.",
      okText: "Salir",
      cancelText: "Cancelar",
      okButtonProps: { danger: true },
      onOk: () => {
        const pending = pendingNavigation.current;
        if (pending) {
          endMovement();
          pending.navigateFn(pending.destination);
        }
      },
      onCancel: () => {
        pendingNavigation.current = null;
      },
    });
  }, [itemsCount, endMovement]);

  return (
    <MovimientoSessionContext.Provider value={{ hasActiveItems, itemsCount, startMovement, updateItems, endMovement, confirmExit }}>
      {children}
    </MovimientoSessionContext.Provider>
  );
};

export const useMovimientoSession = (): MovimientoSessionContextValue => {
  const ctx = useContext(MovimientoSessionContext);
  if (!ctx) throw new Error("useMovimientoSession debe usarse dentro de MovimientoSessionProvider");
  return ctx;
};
