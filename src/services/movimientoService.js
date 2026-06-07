const DB_KEY = "movimientos_db";

const dispatchUpdate = () => {
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(
    new CustomEvent("local-db-update", {
      detail: { type: "movimiento_actualizado" },
    }),
  );
};

export const movimientoService = {
  getAll: () => {
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error leyendo LocalStorage:", error);
      return [];
    }
  },

  getByDate: (fecha) => {
    const todos = movimientoService.getAll();
    return todos.filter((m) => m.fecha === fecha);
  },

  save: (movimiento, user) => {
    try {
      const historialPrevio = movimientoService.getAll();

      const now = new Date();
      const timeZone = "America/Argentina/Buenos_Aires";
      const fecha = now.toLocaleDateString("en-CA", { timeZone });
      const hora = now.toLocaleTimeString("es-AR", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const nuevoRegistro = {
        ...movimiento,
        id: Date.now(),
        fecha,
        hora,
        usuario: user?.nombre || "Admin",
        formaPago: movimiento.formaPago || "Efectivo",
        entidad: movimiento.entidad || { id: 0, nombre: "Caja Interna" },
        importe: Number(movimiento.importe) || 0,
      };

      const nuevoHistorial = [nuevoRegistro, ...historialPrevio];
      localStorage.setItem(DB_KEY, JSON.stringify(nuevoHistorial));
      dispatchUpdate();

      return { success: true, data: nuevoRegistro };
    } catch (error) {
      console.error("Error al guardar movimiento:", error);
      return { success: false, error };
    }
  },

  update: (id, data) => {
    try {
      const todos = movimientoService.getAll();
      const index = todos.findIndex((m) => m.id === id);
      if (index === -1) return { success: false, error: "No encontrado" };

      todos[index] = { ...todos[index], ...data };
      localStorage.setItem(DB_KEY, JSON.stringify(todos));
      dispatchUpdate();

      return { success: true, data: todos[index] };
    } catch (error) {
      console.error("Error al actualizar movimiento:", error);
      return { success: false, error };
    }
  },

  deleteById: (id) => {
    try {
      const todos = movimientoService.getAll();
      const filtered = todos.filter((m) => m.id !== id);
      localStorage.setItem(DB_KEY, JSON.stringify(filtered));
      dispatchUpdate();

      return { success: true };
    } catch (error) {
      console.error("Error al eliminar movimiento:", error);
      return { success: false, error };
    }
  },

  getLeyendaInformativa: (movimiento, tipos) => {
    const { tipo, formaPago } = movimiento;
    const esEfectivo = formaPago === "Efectivo";
    const esSalida = tipo === tipos.PAGO || tipo === tipos.RETIRO;

    if (esEfectivo) {
      return esSalida
        ? "Esta salida de efectivo se descontará de la caja física."
        : "Esta entrada de efectivo se sumará a la caja física.";
    }

    const leyendasDigitales = {
      Transferencia: `Se registrará como un entrada en tu cuenta de ${formaPago}.`,
      QR: `Se registrará como un entrada en tu cuenta de ${formaPago}.`,
      Debito: "El importe impactará a través de la terminal de tarjetas.",
      Credito: "El importe impactará a través de la terminal de tarjetas.",
      "Cta Corriente":
        "Este monto se cargará al saldo de la cuenta del cliente/proveedor.",
    };

    return (
      leyendasDigitales[formaPago] ||
      "Se registrará el movimiento bajo la forma de pago seleccionada."
    );
  },
};
