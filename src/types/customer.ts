import type { Entity } from './common';

export interface Customer extends Entity {
  telefono?: string;
  email?: string;
  direccion?: string;
  cuit?: string;
  saldo?: number;
  ctaCteConfig?: CtaCteConfig;
}

export interface CtaCteConfig {
  habilitada: boolean;
  limite?: number;
}
