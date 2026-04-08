/**
 * Servicio para la gestión de movimientos de caja
 * Ubicación sugerida: src/services/movimientoService.js
 */

const DB_KEY = "movimientos_db";

export const movimientoService = {
  /**
   * Obtiene todos los movimientos almacenados en LocalStorage
   */
  getAll: () => {
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error leyendo LocalStorage:", error);
      return [];
    }
  },

  /**
   * Registra un nuevo movimiento y notifica a la aplicación para actualizar la UI
   */
  save: (movimiento, user) => {
    try {
      const historialPrevio = movimientoService.getAll();

      const nuevoRegistro = {
        ...movimiento,
        id: Date.now(),
        // Fecha en formato ISO YYYY-MM-DD para compatibilidad con filtros de DayJS
        fecha: new Date().toISOString().split("T")[0],
        hora: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        usuario: user?.nombre || "Admin",
        formaPago: movimiento.formaPago || "Efectivo",
        entidad: movimiento.entidad || { id: 0, nombre: "Caja Interna" },
        importe: Number(movimiento.importe) || 0,
      };

      const nuevoHistorial = [nuevoRegistro, ...historialPrevio];
      localStorage.setItem(DB_KEY, JSON.stringify(nuevoHistorial));

      // --- NOTIFICACIONES DE ACTUALIZACIÓN ---

      // 1. Notificar a otras pestañas o instancias de la PWA (Evento Nativo)
      window.dispatchEvent(new Event("storage"));

      // 2. Notificar a la pestaña actual (Evento Personalizado)
      // Esto es lo que permite que el Dashboard se actualice al instante sin recargar
      window.dispatchEvent(
        new CustomEvent("local-db-update", {
          detail: { type: "movimiento_nuevo", date: nuevoRegistro.fecha },
        }),
      );

      return { success: true, data: nuevoRegistro };
    } catch (error) {
      console.error("Error al guardar movimiento:", error);
      return { success: false, error };
    }
  },

  /**
   * Retorna la leyenda informativa según el tipo de movimiento y forma de pago
   */
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
