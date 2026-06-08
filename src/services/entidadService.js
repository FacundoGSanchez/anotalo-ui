const STORAGE_PREFIX = "db_";

export const entidadService = {
  getAll: (tipo) => {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${tipo}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error leyendo entidades (${tipo}):`, error);
      return [];
    }
  },

  getActivos: (tipo) => {
    const todos = entidadService.getAll(tipo);
    return todos.filter((item) => item.activo !== false);
  },

  getById: (tipo, id) => {
    const todos = entidadService.getAll(tipo);
    return todos.find((e) => String(e.id) === String(id)) || null;
  },

  create: (tipo, values) => {
    try {
      const db = entidadService.getAll(tipo);
      const ultimoNro =
        db.length > 0 ? Math.max(...db.map((e) => parseInt(e.nro) || 0)) : 0;
      const nuevoItem = {
        ...values,
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

  update: (tipo, id, values) => {
    try {
      const db = entidadService.getAll(tipo);
      const nuevaLista = db.map((e) =>
        String(e.id) === String(id) ? { ...e, ...values } : e,
      );
      localStorage.setItem(`${STORAGE_PREFIX}${tipo}`, JSON.stringify(nuevaLista));
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar entidad:", error);
      return { success: false, error };
    }
  },

  saveCtaCteConfig: (tipo, id, ctaCteConfig) => {
    return entidadService.update(tipo, id, { ctaCteConfig });
  },

  softDelete: (tipo, id) => {
    return entidadService.update(tipo, id, { activo: false });
  },
};
