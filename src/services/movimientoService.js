import { MOVIMIENTO_TIPOS } from "../constants/posConstants";
import { entidadService } from "./entidadService";
import { authService } from "./authService";
import { orgService } from "./orgService";

const DB_KEY = "movimientos_db";
const TIMEZONE = "America/Argentina/Buenos_Aires";

const dispatchUpdate = () => {
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(
    new CustomEvent("local-db-update", {
      detail: { type: "movimiento_actualizado" },
    }),
  );
};

const extraerFechaHora = (fechaRegistro) => {
  if (!fechaRegistro) return { fecha: "", hora: "" };
  const d = new Date(fechaRegistro);
  const fecha = d.toLocaleDateString("en-CA", { timeZone: TIMEZONE });
  const hora = d.toLocaleTimeString("es-AR", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return { fecha, hora };
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

const tieneCtaCte = (mov) => {
  if (mov.formaPagos?.length > 0) {
    return mov.formaPagos.some((p) => (p.nombre || p.key) === "Cta Corriente");
  }
  return mov.formaPago === "Cta Corriente";
};

const getCtaCteImporte = (mov) => {
  if (mov.formaPagos?.length > 0) {
    const fp = mov.formaPagos.find((p) => (p.nombre || p.key) === "Cta Corriente");
    return fp ? Number(fp.importe) || 0 : 0;
  }
  return mov.formaPago === "Cta Corriente" ? (Number(mov.importe) || 0) : 0;
};

const recalcularSaldoEntidad = (entidadId, movimiento) => {
  const tipo = getTipoEntidadFromMovimiento(movimiento);
  if (!tipo || !entidadId) return;

  const movs = movimientoService.getAll().filter(
    (m) =>
      m.entidad?.id === entidadId &&
      (tieneCtaCte(m) || m.tipo === MOVIMIENTO_TIPOS.COBRO),
  );

  let saldo = 0;
  movs.forEach((m) => {
    const importe = m.tipo === MOVIMIENTO_TIPOS.COBRO
      ? (Number(m.importe) || 0)
      : getCtaCteImporte(m);
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

const toStoredFormat = (movimiento, user) => {
  const now = new Date();
  const fechaRegistro = now.toISOString();

  const formaPagosNorm = movimiento.formaPagos?.length > 0
    ? movimiento.formaPagos.map((fp) => ({
      nombre: fp.nombre || fp.key,
      importe: Number(fp.importe) || 0,
    }))
    : (movimiento.formaPago
      ? [{ nombre: movimiento.formaPago, importe: Number(movimiento.importe) || 0 }]
      : []);

  const lineItemsNorm = (movimiento.lineItems || []).map((item, idx) => ({
    id: item.id || (Date.now() + idx),
    importe: Number(item.importe) || 0,
    itemId: item.rubro?.id ?? item.itemId ?? 0,
    itemDetalle: item.rubro?.nombre || item.itemDetalle || "",
  }));

  return {
    id: Date.now(),
    tipo: movimiento.tipo,
    importe: Number(movimiento.importe) || 0,
    entidad: movimiento.entidad || { id: 0, nombre: "Caja Interna" },
    usuarioId: user?.id || 1,
    usuarioNombre: user?.nombre || "Admin",
    sucursalId: authService.getCurrentSucursalId(),
    organizacionId: authService.getCurrentOrgId(),
    observacion: movimiento.observacion || "",
    lineItems: lineItemsNorm,
    formaPagos: formaPagosNorm,
    fechaRegistro,
  };
};

const buildBackendParams = (movimiento, user) => {
  const orgId = authService.getCurrentOrgId();
  const orgConfig = orgService.getConfig(orgId);
  const formasPagoIds = orgConfig.formasPagoIds || [];

  const lineItems = (movimiento.lineItems || []).map((item) => ({
    itemId: item.rubro?.id ?? item.itemId ?? 0,
    itemDetalle: item.rubro?.nombre || item.itemDetalle || "",
    importe: Number(item.importe) || 0,
  }));

  const formaPagosRaw = movimiento.formaPagos?.length > 0
    ? movimiento.formaPagos
    : (movimiento.formaPago
      ? [{ nombre: movimiento.formaPago, importe: Number(movimiento.importe) || 0 }]
      : []);

  const formaPagos = formaPagosRaw.map((fp) => {
    const nombre = fp.nombre || fp.key;
    const match = formasPagoIds.find((f) => f.nombre === nombre);
    return {
      formaPagoId: match?.id || 0,
      importe: Number(fp.importe) || 0,
    };
  });

  return {
    pId: movimiento.id || null,
    pTipo: movimiento.tipo,
    pImporteTotal: Number(movimiento.importe) || 0,
    pEntidadId: movimiento.entidad?.id || 0,
    pEntidadNombre: movimiento.entidad?.nombre || "Caja Interna",
    pUsuarioId: user?.id || 1,
    pSucursalId: authService.getCurrentSucursalId(),
    pOrganizacionId: orgId,
    pObservacion: movimiento.observacion || "",
    pLineItems: lineItems,
    pFormaPagos: formaPagos,
  };
};

export const movimientoService = {
  extraerFechaHora,

  buildBackendParams,

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
    return todos.filter((m) => {
      const { fecha: f } = extraerFechaHora(m.fechaRegistro);
      return f === fecha;
    });
  },

  save: (movimiento, user) => {
    try {
      const historialPrevio = movimientoService.getAll();
      const nuevoRegistro = toStoredFormat(movimiento, user);

      const esCtaCte =
        tieneCtaCte(movimiento) ||
        (movimiento.entidad?.id && movimiento.tipo === MOVIMIENTO_TIPOS.COBRO);

      if (esCtaCte && movimiento.entidad?.id) {
        const movsEntidad = historialPrevio
          .filter(
            (m) =>
              m.entidad?.id === movimiento.entidad.id &&
              (tieneCtaCte(m) || m.tipo === MOVIMIENTO_TIPOS.COBRO),
          )
          .sort((a, b) => a.id - b.id);
        const ultimoConSaldo = [...movsEntidad]
          .reverse()
          .find((m) => m.saldoCtaCte != null);
        const saldoAnterior = ultimoConSaldo ? ultimoConSaldo.saldoCtaCte : 0;
        const importeNum = getCtaCteImporte(movimiento) || Number(movimiento.importe) || 0;
        if (movimiento.tipo === MOVIMIENTO_TIPOS.VENTA) {
          nuevoRegistro.saldoCtaCte = saldoAnterior + importeNum;
        } else if (movimiento.tipo === MOVIMIENTO_TIPOS.PAGO) {
          nuevoRegistro.saldoCtaCte = saldoAnterior - importeNum;
        } else if (movimiento.tipo === MOVIMIENTO_TIPOS.COBRO) {
          nuevoRegistro.saldoCtaCte = saldoAnterior - importeNum;
        } else {
          nuevoRegistro.saldoCtaCte = saldoAnterior;
        }
      } else {
        nuevoRegistro.saldoCtaCte = null;
      }

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
        (tieneCtaCte(eliminado) || eliminado.tipo === MOVIMIENTO_TIPOS.COBRO)
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

  tieneCtaCte: (mov) => tieneCtaCte(mov),

  getCtaCteImporte: (mov) => getCtaCteImporte(mov),

  getLeyendaInformativa: (movimiento, tipos) => {
    const { tipo, formaPago, formaPagos } = movimiento;

    if (formaPagos?.length > 1) {
      const partes = formaPagos.map((fp) => {
        const fmt = Number(fp.importe).toLocaleString("es-AR");
        return `${fp.nombre || fp.key}: $${fmt}`;
      });
      return `Pago dividido en ${formaPagos.length} formas: ${partes.join(", ")}.`;
    }

    const fp = formaPagos?.[0]?.nombre || formaPagos?.[0]?.key || formaPago;
    const esEfectivo = fp === "Efectivo";
    const esSalida = tipo === tipos.PAGO || tipo === tipos.RETIRO || tipo === tipos.COBRO;

    if (esEfectivo) {
      return esSalida
        ? "Esta salida de efectivo se descontará de la caja física."
        : "Esta entrada de efectivo se sumará a la caja física.";
    }

    const leyendasDigitales = {
      Transferencia: `Se registrará como un entrada en tu cuenta de ${fp}.`,
      QR: `Se registrará como un entrada en tu cuenta de ${fp}.`,
      Debito: "El importe impactará a través de la terminal de tarjetas.",
      Credito: "El importe impactará a través de la terminal de tarjetas.",
      "Cta Corriente":
        "Este monto se cargará al saldo de la cuenta del cliente/proveedor.",
    };

    return (
      leyendasDigitales[fp] ||
      "Se registrará el movimiento bajo la forma de pago seleccionada."
    );
  },
};
