import { FORMAS_PAGO } from "../constants/posConstants";

const getConfigKey = (orgId) => `org_config_${orgId || "default"}`;

const TIPOS_MOVIMIENTO = ["Venta", "Pago"];

const MERGE_PROPS = ["icon", "color", "requiereEntidad", "impactaCaja", "impactaCtaCte"];

const mergeWithDefault = (orgFormas) => {
  return (orgFormas || [])
    .filter((f) => f.enabled !== false)
    .map((f) => {
      const defaultOpt = FORMAS_PAGO.find((dp) => dp.key === f.key);
      const merged = {
        key: f.key,
        label: f.label || f.key,
      };
      MERGE_PROPS.forEach((prop) => {
        merged[prop] = f[prop] ?? defaultOpt?.[prop] ?? null;
      });
      return merged;
    });
};

export const orgService = {
  getConfig: (orgId) => {
    try {
      const raw = localStorage.getItem(getConfigKey(orgId));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  saveConfig: (orgId, data) => {
    try {
      const existing = orgService.getConfig(orgId);
      const merged = { ...existing, ...data };
      localStorage.setItem(getConfigKey(orgId), JSON.stringify(merged));
      return { success: true };
    } catch (error) {
      console.error("Error guardando config de org:", error);
      return { success: false, error };
    }
  },

  initOrgConfig: (orgId, config) => {
    const existing = orgService.getConfig(orgId);
    if (!existing.formasPago && config?.formasPago) {
      orgService.saveConfig(orgId, { formasPago: config.formasPago });
    }
  },

  getFormasPago: (orgId, tipo) => {
    const config = orgService.getConfig(orgId);
    const formasPorTipo = config.formasPago?.[tipo];

    if (formasPorTipo && formasPorTipo.length > 0) {
      return mergeWithDefault(formasPorTipo);
    }

    // Fallback: si existe config general pero sin separar por tipo
    if (config.formasPago && !Array.isArray(config.formasPago)) {
      for (const t of TIPOS_MOVIMIENTO) {
        const fps = config.formasPago[t];
        if (fps && fps.length > 0) {
          return mergeWithDefault(fps);
        }
      }
    }

    return FORMAS_PAGO;
  },

  saveFormasPago: (orgId, tipo, formas) => {
    const config = orgService.getConfig(orgId);
    const current = config.formasPago || {};
    config.formasPago = { ...current, [tipo]: formas };
    return orgService.saveConfig(orgId, { formasPago: config.formasPago });
  },
};
