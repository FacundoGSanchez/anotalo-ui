import { MOVIMIENTO_TIPOS } from "../constants/posConstants";
import { entidadService } from "./entidadService";

const DB_KEY = "movimientos_db";

const dispatchUpdate = () => {
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(
    new CustomEvent("local-db-update", {
      detail: { type: "movimiento_actualizado" },
    }),
  );
};

const getTipoEntidadFromMovimiento = (movimiento) => {
  if (movimiento.tipo === MOVIMIENTO_TIPOS.VENTA || movimiento.tipo === MOVIMIENTO_TIPOS.COBRO) {
    return "clientes";
  }
  if (movimiento.tipo === MOVIMIENTO_TIPOS.PAGO) {
    return "proveedores";
  }
  return null;
};

const recalcularSaldoEntidad = (entidadId, movimiento) => {
  const tipo = getTipoEntidadFromMovimiento(movimiento);
  if (!tipo || !entidadId) return;

  const movs = movimientoService.getAll().filter(
    (m) =>
      m.entidad?.id === entidadId &&
      (m.formaPago === "Cta Corriente" || m.tipo === MOVIMIENTO_TIPOS.COBRO),
  );

  let saldo = 0;
  movs.forEach((m) => {
    const importe = Number(m.importe) || 0;
    if (m.tipo === MOVIMIENTO_TIPOS.VENTA) {
      saldo += importe;
    } else if (m.tipo === MOVIMIENTO_TIPOS.COBRO || m.tipo === MOVIMIENTO_TIPOS.PAGO) {
      saldo -= importe;
    }
  });

  const entidad = entidadService.getById(tipo, entidadId);
  if (entidad) {
    entidadService.update(tipo, entidadId, { ...entidad, saldo });
  }
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

      const esCtaCte =
        movimiento.formaPago === "Cta Corriente" ||
        (movimiento.entidad?.id && movimiento.tipo === MOVIMIENTO_TIPOS.COBRO);

      let saldoCtaCte = null;
      if (esCtaCte && movimiento.entidad?.id) {
        const movsEntidad = historialPrevio
          .filter(
            (m) =>
              m.entidad?.id === movimiento.entidad.id &&
              (m.formaPago === "Cta Corriente" || m.tipo === MOVIMIENTO_TIPOS.COBRO),
          )
          .sort((a, b) => a.id - b.id);
        const ultimoConSaldo = [...movsEntidad]
          .reverse()
          .find((m) => m.saldoCtaCte != null);
        const saldoAnterior = ultimoConSaldo ? ultimoConSaldo.saldoCtaCte : 0;
        const importeNum = Number(movimiento.importe) || 0;
        if (movimiento.tipo === MOVIMIENTO_TIPOS.VENTA) {
          saldoCtaCte = saldoAnterior + importeNum;
        } else if (movimiento.tipo === MOVIMIENTO_TIPOS.PAGO) {
          saldoCtaCte = saldoAnterior - importeNum;
        } else if (movimiento.tipo === MOVIMIENTO_TIPOS.COBRO) {
          saldoCtaCte = saldoAnterior - importeNum;
        } else {
          saldoCtaCte = saldoAnterior;
        }
      }

      const nuevoRegistro = {
        ...movimiento,
        id: Date.now(),
        fecha,
        hora,
        usuario: user?.nombre || "Admin",
        formaPago: movimiento.formaPago || "Efectivo",
        entidad: movimiento.entidad || { id: 0, nombre: "Caja Interna" },
        importe: Number(movimiento.importe) || 0,
        observacion: movimiento.observacion || "",
        saldoCtaCte,
      };

      const nuevoHistorial = [nuevoRegistro, ...historialPrevio];
      localStorage.setItem(DB_KEY, JSON.stringify(nuevoHistorial));

      if (esCtaCte && movimiento.entidad?.id) {
        recalcularSaldoEntidad(movimiento.entidad.id, movimiento);
      }

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
      const eliminado = todos.find((m) => m.id === id);
      const filtered = todos.filter((m) => m.id !== id);
      localStorage.setItem(DB_KEY, JSON.stringify(filtered));

      if (
        eliminado &&
        eliminado.entidad?.id &&
        (eliminado.formaPago === "Cta Corriente" || eliminado.tipo === MOVIMIENTO_TIPOS.COBRO)
      ) {
        recalcularSaldoEntidad(eliminado.entidad.id, eliminado);
      }

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
    const esSalida = tipo === tipos.PAGO || tipo === tipos.RETIRO || tipo === tipos.COBRO;

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
