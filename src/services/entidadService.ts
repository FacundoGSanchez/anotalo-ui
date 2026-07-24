import type { Entity, ServiceResult } from "@/types/common";

const STORAGE_PREFIX = "db_";

export const entidadService = {
  getAll: (tipo: string): Entity[] => {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${tipo}`);
      return data ? (JSON.parse(data) as Entity[]) : [];
    } catch (error) {
      console.error(`Error leyendo entidades (${tipo}):`, error);
      return [];
    }
  },

  getActivos: (tipo: string): Entity[] => {
    const todos = entidadService.getAll(tipo);
    return todos.filter((item) => item.activo !== false);
  },

  getById: (tipo: string, id: number): Entity | null => {
    const todos = entidadService.getAll(tipo);
    return todos.find((e) => String(e.id) === String(id)) || null;
  },

  create: (tipo: string, values: Partial<Entity>): ServiceResult<Entity> => {
    try {
      const db = entidadService.getAll(tipo);
      const ultimoNro =
        db.length > 0 ? Math.max(...db.map((e) => parseInt(String(e.nro)) || 0)) : 0;
      const nuevoItem: Entity = {
        ...values as Entity,
        id: Date.now(),
        nro: ultimoNro + 1,
        activo: true,
      };
      localStorage.setItem(
        `${STORAGE_PREFIX}${tipo}`,
        JSON.stringify([...db, nuevoItem]),
      );
      return { success: true, data: nuevoItem };
    } catch (error) {
      console.error("Error al crear entidad:", error);
      return { success: false, error };
    }
  },

  update: (tipo: string, id: number, values: Partial<Entity>): ServiceResult => {
    try {
      const db = entidadService.getAll(tipo);
      const nuevaLista = db.map((e) =>
        String(e.id) === String(id) ? { ...e, ...values } : e,
      );
      localStorage.setItem(`${STORAGE_PREFIX}${tipo}`, JSON.stringify(nuevaLista));
      window.dispatchEvent(new CustomEvent("local-db-update", {
        detail: { type: "entidad_actualizada" },
      }));
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar entidad:", error);
      return { success: false, error };
    }
  },

  saveCtaCteConfig: (tipo: string, id: number, ctaCteConfig: unknown): ServiceResult => {
    return entidadService.update(tipo, id, { ctaCteConfig } as Partial<Entity>);
  },

  softDelete: (tipo: string, id: number): ServiceResult => {
    return entidadService.update(tipo, id, { activo: false });
  },
};
