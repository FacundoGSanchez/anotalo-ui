import type { Entity, FormaPagoNormalized, LineItem } from './common';

export type MovimientoTipo = 'Venta' | 'Pago' | 'Cobro' | 'Retiro' | 'Ingreso';

export interface Movimiento {
  id: number;
  tipo: MovimientoTipo;
  importe: number;
  entidad?: Entity;
  usuarioId?: number;
  usuarioNombre?: string;
  usuario?: string;
  hora?: string;
  sucursalId?: number | null;
  organizacionId?: number | null;
  observacion?: string;
  lineItems?: LineItem[];
  formaPagos?: FormaPagoNormalized[];
  formaPago?: string;
  fechaRegistro?: string;
  saldoCtaCte?: number | null;
}

export interface MovimientoInput {
  tipo: MovimientoTipo;
  importe: number;
  entidad?: Entity | null;
  observacion?: string;
  lineItems?: LineItem[];
  formaPago?: string | null;
  formaPagos?: Array<{ nombre: string; key?: string; importe: number }>;
}

export interface MovimientoBackendParams {
  pId: number | null;
  pTipo: MovimientoTipo;
  pImporteTotal: number;
  pEntidadId: number;
  pEntidadNombre: string;
  pUsuarioId: number;
  pSucursalId: number | null;
  pOrganizacionId: number | null;
  pObservacion: string;
  pLineItems: Array<{ itemId: number; itemDetalle: string; importe: number }>;
  pFormaPagos: Array<{ formaPagoId: number; importe: number }>;
}

export interface Cierre {
  id: number;
  fecha: string;
  hora: string;
  saldo: number;
  usuario: string;
}
