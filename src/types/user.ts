import type { Rol } from './common';

export interface Usuario {
  id: number;
  username: string;
  mail?: string;
  nombre: string;
  rol?: string;
  roles?: number[];
  password?: string;
  sucursales?: UsuarioSucursal[];
}

export interface UsuarioSucursal {
  id: number;
  organizacionId: number;
  nombre: string;
}

export interface Session {
  token: string;
  sessionId: string;
  organizaciones: import('./organization').Organizacion[];
  rolesData: Rol[];
  usuario: Usuario;
  sucursales: UsuarioSucursal[];
}

export interface AuthUser {
  id: number;
  username: string;
  mail: string;
  nombre: string;
  rol: string;
  roles: number[];
}
