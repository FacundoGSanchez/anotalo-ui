import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { Modal } from "antd";

const MovimientoSessionContext = createContext(null);

export const MovimientoSessionProvider = ({ children }) => {
  const [itemsCount, setItemsCount] = useState(0);
  const pendingNavigation = useRef(null);

  const hasActiveItems = itemsCount > 0;

  const startMovement = useCallback(() => {
    setItemsCount(0);
  }, []);

  const updateItems = useCallback((count) => {
    setItemsCount(count);
  }, []);

  const endMovement = useCallback(() => {
    setItemsCount(0);
    pendingNavigation.current = null;
  }, []);

  const confirmExit = useCallback((destination, navigateFn) => {
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

export const useMovimientoSession = () => {
  const ctx = useContext(MovimientoSessionContext);
  if (!ctx) throw new Error("useMovimientoSession debe usarse dentro de MovimientoSessionProvider");
  return ctx;
};
