const DB_KEY = "cierres_db";

const dispatchUpdate = () => {
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(
    new CustomEvent("local-db-update", {
      detail: { type: "cierre_actualizado" },
    }),
  );
};

export const cierreService = {
  getAll: () => {
    try {
      const data = localStorage.getItem(DB_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  save: (saldo, user) => {
    try {
      const historial = cierreService.getAll();
      const now = new Date();
      const timeZone = "America/Argentina/Buenos_Aires";
      const fecha = now.toLocaleDateString("en-CA", { timeZone });
      const hora = now.toLocaleTimeString("es-AR", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const nuevo = {
        id: Date.now(),
        fecha,
        hora,
        saldo: Number(saldo) || 0,
        usuario: user?.nombre || "Admin",
      };

      localStorage.setItem(DB_KEY, JSON.stringify([nuevo, ...historial]));
      dispatchUpdate();
      return { success: true, data: nuevo };
    } catch (error) {
      console.error("Error al guardar cierre:", error);
      return { success: false, error };
    }
  },

  deleteById: (id) => {
    try {
      const todos = cierreService.getAll();
      const filtered = todos.filter((c) => c.id !== id);
      localStorage.setItem(DB_KEY, JSON.stringify(filtered));
      dispatchUpdate();
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar cierre:", error);
      return { success: false, error };
    }
  },
};
