import type { FormaPagoItem, FormaPagoConfig } from './common';

export interface Organizacion {
  id: number;
  nombre: string;
  sucursalDefault: number;
  FormasPago?: Record<string, FormaPagoItem[]>;
  TiposMovimiento?: string[];
}

export interface OrgConfig {
  formasPago?: Record<string, FormaPagoConfig[]> | FormaPagoConfig[];
  formasPagoIds?: FormaPagoConfig[];
  rubros?: Rubro[];
  configPOS?: ConfigPOS;
  tiposMovimiento?: string[];
}

export interface ConfigPOS {
  usaRubro: boolean;
}

export interface Rubro {
  id: number;
  sigla: string;
  nombre: string;
  grupo: string;
}

export interface Sucursal {
  id: number;
  organizacionId: number;
  nombre: string;
}
