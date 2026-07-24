import { MOVIMIENTO_TIPOS } from "../constants/posConstants";
import { entidadService } from "./entidadService";
import { authService } from "./authService";
import { orgService } from "./orgService";
import type { Movimiento, MovimientoBackendParams, MovimientoTipo } from "@/types/movement";
import type { LineItem, FormaPagoNormalized, Entity, FormaPagoConfig, ServiceResult } from "@/types/common";

const DB_KEY = "movimientos_db";
const TIMEZONE = "America/Argentina/Buenos_Aires";

const dispatchUpdate = (): void => {
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(
    new CustomEvent("local-db-update", {
      detail: { type: "movimiento_actualizado" },
    }),
  );
};

interface FechaHora {
  fecha: string;
  hora: string;
}

const extraerFechaHora = (fechaRegistro: string | undefined): FechaHora => {
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

const getTipoEntidadFromMovimiento = (movimiento: Partial<Movimiento>): string | null => {
  if (movimiento.tipo === MOVIMIENTO_TIPOS.VENTA || movimiento.tipo === MOVIMIENTO_TIPOS.COBRO) {
    return "clientes";
  }
  if (movimiento.tipo === MOVIMIENTO_TIPOS.PAGO) {
    return "proveedores";
  }
  return null;
};

interface FormaPagoLike {
  nombre?: string;
  key?: string;
  importe: number | string;
}

const tieneCtaCte = (mov: Partial<Movimiento>): boolean => {
  if (mov.formaPagos && mov.formaPagos.length > 0) {
    return mov.formaPagos.some((p) => (p.nombre || (p as FormaPagoLike).key) === "Cta Corriente");
  }
  return mov.formaPago === "Cta Corriente";
};

const getCtaCteImporte = (mov: Partial<Movimiento>): number => {
  if (mov.formaPagos && mov.formaPagos.length > 0) {
    const fp = mov.formaPagos.find((p) => (p.nombre || (p as FormaPagoLike).key) === "Cta Corriente");
    return fp ? Number(fp.importe) || 0 : 0;
  }
  return mov.formaPago === "Cta Corriente" ? (Number(mov.importe) || 0) : 0;
};

const recalcularSaldoCadena = (entidadId: number): void => {
  if (!entidadId) return;

  const todos = movimientoService.getAll();
  const movsEntidad = todos
    .filter(
      (m) =>
        m.entidad?.id === entidadId &&
        (tieneCtaCte(m) || m.tipo === MOVIMIENTO_TIPOS.COBRO),
    )
    .sort((a, b) => a.id - b.id);

  let saldo = 0;
  movsEntidad.forEach((m) => {
    const importe =
      m.tipo === MOVIMIENTO_TIPOS.COBRO
        ? Number(m.importe) || 0
        : getCtaCteImporte(m);
    if (m.tipo === MOVIMIENTO_TIPOS.VENTA) {
      saldo += importe;
    } else if (
      m.tipo === MOVIMIENTO_TIPOS.COBRO ||
      m.tipo === MOVIMIENTO_TIPOS.PAGO
    ) {
      saldo -= importe;
    }
    m.saldoCtaCte = saldo;
  });

  localStorage.setItem(DB_KEY, JSON.stringify(todos));

  const tipoEntidad = getTipoEntidadFromMovimiento(movsEntidad[0] || {});
  if (tipoEntidad) {
    const entidad = entidadService.getById(tipoEntidad, entidadId);
    if (entidad) {
      entidadService.update(tipoEntidad, entidadId, { ...entidad, saldo } as Partial<Entity>);
    }
  }
};

interface MovimientoLike {
  tipo: MovimientoTipo;
  importe: number | string;
  entidad?: Entity | null;
  observacion?: string;
  formaPago?: string | null;
  formaPagos?: Array<{ nombre?: string; key?: string; importe: number | string }>;
  lineItems?: Array<{
    id?: number;
    importe: number | string;
    rubro?: { id: number; nombre: string };
    itemId?: number;
    itemDetalle?: string;
  }>;
}

interface StoredMovimiento extends Movimiento {
  saldoCtaCte: number | null;
}

const toStoredFormat = (movimiento: MovimientoLike, user: { id?: number; nombre?: string }): StoredMovimiento => {
  const now = new Date();
  const fechaRegistro = now.toISOString();

  const formaPagosNorm: FormaPagoNormalized[] = movimiento.formaPagos && movimiento.formaPagos.length > 0
    ? movimiento.formaPagos.map((fp) => ({
      nombre: fp.nombre || fp.key || "",
      importe: Number(fp.importe) || 0,
    }))
    : (movimiento.formaPago
      ? [{ nombre: movimiento.formaPago, importe: Number(movimiento.importe) || 0 }]
      : []);

  const lineItemsNorm: LineItem[] = (movimiento.lineItems || []).map((item, idx) => ({
    id: item.id || (Date.now() + idx),
    importe: Number(item.importe) || 0,
    itemId: item.rubro?.id ?? item.itemId ?? 0,
    itemDetalle: item.rubro?.nombre || item.itemDetalle || "",
  }));

  return {
    id: Date.now(),
    tipo: movimiento.tipo,
    importe: Number(movimiento.importe) || 0,
    entidad: movimiento.entidad || { id: 0, nombre: "Caja Interna", activo: true },
    usuarioId: user?.id || 1,
    usuarioNombre: user?.nombre || "Admin",
    sucursalId: authService.getCurrentSucursalId(),
    organizacionId: authService.getCurrentOrgId(),
    observacion: movimiento.observacion || "",
    lineItems: lineItemsNorm,
    formaPagos: formaPagosNorm,
    fechaRegistro,
    saldoCtaCte: null,
  };
};

const buildBackendParams = (movimiento: MovimientoLike, user: { id?: number; nombre?: string }): MovimientoBackendParams => {
  const orgId = authService.getCurrentOrgId();
  const orgConfig = orgService.getConfig(orgId);
  const formasPagoIds: FormaPagoConfig[] = orgConfig.formasPagoIds || [];

  const lineItems: Array<{ itemId: number; itemDetalle: string; importe: number }> = (movimiento.lineItems || []).map((item) => ({
    itemId: item.rubro?.id ?? item.itemId ?? 0,
    itemDetalle: item.rubro?.nombre || item.itemDetalle || "",
    importe: Number(item.importe) || 0,
  }));

  const formaPagosRaw = movimiento.formaPagos && movimiento.formaPagos.length > 0
    ? movimiento.formaPagos
    : (movimiento.formaPago
      ? [{ nombre: movimiento.formaPago, importe: Number(movimiento.importe) || 0 }]
      : []);

  const formaPagos: Array<{ formaPagoId: number; importe: number }> = formaPagosRaw.map((fp) => {
    const nombre = fp.nombre || fp.key;
    const match = formasPagoIds.find((f) => f.nombre === nombre);
    return {
      formaPagoId: match?.id || 0,
      importe: Number(fp.importe) || 0,
    };
  });

  return {
    pId: (movimiento as { id?: number }).id || null,
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

interface TiposMap {
  PAGO: string;
  RETIRO: string;
  COBRO: string;
  [key: string]: string;
}

export const movimientoService = {
  extraerFechaHora,

  buildBackendParams,

  getAll: (): Movimiento[] => {
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? (JSON.parse(data) as Movimiento[]) : [];
    } catch (error) {
      console.error("Error leyendo LocalStorage:", error);
      return [];
    }
  },

  getByDate: (fecha: string): Movimiento[] => {
    const todos = movimientoService.getAll();
    return todos.filter((m) => {
      const { fecha: f } = extraerFechaHora(m.fechaRegistro);
      return f === fecha;
    });
  },

  save: (movimiento: MovimientoLike, user: { id?: number; nombre?: string }): ServiceResult<StoredMovimiento> => {
    try {
      const historialPrevio = movimientoService.getAll() as StoredMovimiento[];
      const nuevoRegistro = toStoredFormat(movimiento, user);

      const esCtaCte =
        tieneCtaCte(movimiento as Partial<Movimiento>) ||
        (movimiento.entidad?.id && movimiento.tipo === MOVIMIENTO_TIPOS.COBRO);

      if (esCtaCte && movimiento.entidad?.id) {
        const movsEntidad = historialPrevio
          .filter(
            (m) =>
              m.entidad?.id === movimiento.entidad!.id &&
              (tieneCtaCte(m) || m.tipo === MOVIMIENTO_TIPOS.COBRO),
          )
          .sort((a, b) => a.id - b.id);
        const ultimoConSaldo = [...movsEntidad]
          .reverse()
          .find((m) => m.saldoCtaCte != null);
        const saldoAnterior = ultimoConSaldo ? ultimoConSaldo.saldoCtaCte : 0;
        const importeNum = getCtaCteImporte(movimiento as Partial<Movimiento>) || Number(movimiento.importe) || 0;
        if (movimiento.tipo === MOVIMIENTO_TIPOS.VENTA) {
          nuevoRegistro.saldoCtaCte = (saldoAnterior || 0) + importeNum;
        } else if (movimiento.tipo === MOVIMIENTO_TIPOS.PAGO) {
          nuevoRegistro.saldoCtaCte = (saldoAnterior || 0) - importeNum;
        } else if (movimiento.tipo === MOVIMIENTO_TIPOS.COBRO) {
          nuevoRegistro.saldoCtaCte = (saldoAnterior || 0) - importeNum;
        } else {
          nuevoRegistro.saldoCtaCte = saldoAnterior;
        }
      } else {
        nuevoRegistro.saldoCtaCte = null;
      }

      const nuevoHistorial = [nuevoRegistro, ...historialPrevio];
      localStorage.setItem(DB_KEY, JSON.stringify(nuevoHistorial));

      if (esCtaCte && movimiento.entidad?.id) {
        recalcularSaldoCadena(movimiento.entidad.id);
      }

      dispatchUpdate();

      return { success: true, data: nuevoRegistro };
    } catch (error) {
      console.error("Error al guardar movimiento:", error);
      return { success: false, error };
    }
  },

  update: (id: number, data: Partial<Movimiento>): ServiceResult<Movimiento> => {
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

  deleteById: (id: number): ServiceResult => {
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
        recalcularSaldoCadena(eliminado.entidad.id);
      }

      dispatchUpdate();

      return { success: true };
    } catch (error) {
      console.error("Error al eliminar movimiento:", error);
      return { success: false, error };
    }
  },

  updateFormaPago: (movimientoId: number, index: number, nuevoNombre: string): ServiceResult<Movimiento> => {
    try {
      const todos = movimientoService.getAll();
      const movIndex = todos.findIndex((m) => m.id === movimientoId);
      if (movIndex === -1) return { success: false, error: "No encontrado" };

      const mov = { ...todos[movIndex] };
      const fp = [...(mov.formaPagos || [])];
      if (!fp[index]) return { success: false, error: "Índice inválido" };

      const antiguoNombre = fp[index].nombre;
      if (antiguoNombre === nuevoNombre) return { success: true, data: mov };

      const importeFp = Number(fp[index].importe) || 0;

      const existenteIdx = fp.findIndex(
        (f, i) => i !== index && f.nombre === nuevoNombre,
      );

      if (existenteIdx !== -1) {
        fp[existenteIdx] = {
          ...fp[existenteIdx],
          importe: Number(fp[existenteIdx].importe) + importeFp,
        };
        fp.splice(index, 1);
      } else {
        fp[index] = { ...fp[index], nombre: nuevoNombre };
      }

      mov.formaPagos = fp;
      mov.formaPago = fp[0]?.nombre || "";
      mov.importe = fp.reduce((s, f) => s + (Number(f.importe) || 0), 0);

      todos[movIndex] = mov;
      localStorage.setItem(DB_KEY, JSON.stringify(todos));

      if (mov.entidad?.id) {
        recalcularSaldoCadena(mov.entidad.id);
      }

      dispatchUpdate();
      return { success: true, data: mov };
    } catch (error) {
      console.error("Error al actualizar forma de pago:", error);
      return { success: false, error };
    }
  },

  tieneCtaCte: (mov: Partial<Movimiento>): boolean => tieneCtaCte(mov),

  getCtaCteImporte: (mov: Partial<Movimiento>): number => getCtaCteImporte(mov),

  getLeyendaInformativa: (movimiento: Partial<Movimiento>, tipos: TiposMap): string => {
    const { tipo, formaPago, formaPagos } = movimiento;

    if (formaPagos && formaPagos.length > 1) {
      const partes = formaPagos.map((fp) => {
        const fmt = Number(fp.importe).toLocaleString("es-AR");
        return `${fp.nombre || (fp as FormaPagoLike).key}: $${fmt}`;
      });
      return `Pago dividido en ${formaPagos.length} formas: ${partes.join(", ")}.`;
    }

    const fp = formaPagos?.[0]?.nombre || (formaPagos?.[0] as FormaPagoLike)?.key || formaPago || "";
    const esEfectivo = fp === "Efectivo";
    const esSalida = tipo === tipos.PAGO || tipo === tipos.RETIRO || tipo === tipos.COBRO;

    if (esEfectivo) {
      return esSalida
        ? "Esta salida de efectivo se descontará de la caja física."
        : "Esta entrada de efectivo se sumará a la caja física.";
    }

    const leyendasDigitales: Record<string, string> = {
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
