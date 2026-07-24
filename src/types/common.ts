export interface Entity {
  id: number;
  nro?: number;
  nombre: string;
  activo: boolean;
  [key: string]: unknown;
}

export interface FormaPagoItem {
  key: string;
  label: string;
  iconKey?: string;
  icon?: React.ReactNode;
  color?: string;
  enabled?: boolean;
  requiereEntidad?: boolean;
  impactaCaja?: boolean;
  impactaCtaCte?: boolean;
}

export interface FormaPagoConfig {
  id: number;
  nombre: string;
  sigla: string;
  requiereEntidad: boolean;
  impactaCaja: boolean;
  impactaCtaCte: boolean;
}

export interface LineItem {
  id: number;
  _id?: number;
  importe: number;
  itemId?: number;
  itemDetalle?: string;
  rubro?: Rubro;
}

export interface Rubro {
  id: number;
  sigla: string;
  nombre: string;
  grupo: string;
}

export interface FormaPagoNormalized {
  nombre: string;
  importe: number;
  key?: string;
}

export interface Permiso {
  modulo: string;
  formulario: string;
  acciones: string[];
}

export interface Rol {
  id: number;
  nombre: string;
  permisos: Permiso[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: unknown;
}

export interface ServiceResult<T = unknown> extends ApiResponse<T> {
  error?: unknown;
}
