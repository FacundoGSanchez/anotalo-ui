import React from "react";
import { FORMAS_PAGO, FORMAS_PAGO_DEFAULT, ICONOS_POS, RUBROS_DEFAULT } from "../constants/posConstants";

const getConfigKey = (orgId) => `org_config_${orgId || "default"}`;

const TIPOS_MOVIMIENTO = ["Venta", "Pago"];

const MERGE_PROPS = ["icon", "color", "requiereEntidad", "impactaCaja", "impactaCtaCte"];

const resolveIcon = (iconKey, fallback) => {
  if (!iconKey) return fallback ?? null;
  const IconComponent = ICONOS_POS[iconKey];
  if (!IconComponent) return fallback ?? null;
  return React.createElement(IconComponent);
};

const mergeWithDefault = (orgFormas) => {
  return (orgFormas || [])
    .filter((f) => f.enabled !== false)
    .map((f) => {
      // New format (saved from FormasPagoConfigPage): items have nombre/sigla
      if (f.nombre) {
        const defaultOpt = FORMAS_PAGO.find((dp) => dp.key === f.nombre);
        return {
          key: f.nombre,
          label: defaultOpt?.label || f.nombre,
          color: defaultOpt?.color || "#1890ff",
          icon: defaultOpt?.icon || null,
          requiereEntidad: f.requiereEntidad ?? defaultOpt?.requiereEntidad ?? false,
          impactaCaja: f.impactaCaja ?? defaultOpt?.impactaCaja ?? false,
          impactaCtaCte: f.impactaCtaCte ?? defaultOpt?.impactaCtaCte ?? false,
        };
      }

      // Legacy format: items have key/label/iconKey
      const defaultOpt = FORMAS_PAGO.find((dp) => dp.key === f.key);
      const merged = {
        key: f.key,
        label: f.label || f.key,
      };
      MERGE_PROPS.forEach((prop) => {
        merged[prop] = f[prop] ?? defaultOpt?.[prop] ?? null;
      });
      merged.icon = resolveIcon(f.iconKey, merged.icon);
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

  getRubros: (orgId) => {
    const config = orgService.getConfig(orgId);
    return config.rubros && config.rubros.length > 0 ? config.rubros : [];
  },

  saveRubros: (orgId, rubros) => {
    return orgService.saveConfig(orgId, { rubros });
  },

  getConfigPOS: (orgId) => {
    const config = orgService.getConfig(orgId);
    return config.configPOS || { usaRubro: false };
  },

  saveConfigPOS: (orgId, configPOS) => {
    return orgService.saveConfig(orgId, { configPOS });
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

    // No config at all: convert FORMAS_PAGO_DEFAULT to legacy format for display
    return mergeWithDefault(FORMAS_PAGO_DEFAULT);
  },

  getFormasPagoDefault: () => FORMAS_PAGO_DEFAULT,

  getFormasPagoIds: (orgId) => {
    const config = orgService.getConfig(orgId);
    return config.formasPagoIds || [];
  },

  saveFormasPagoIds: (orgId, ids) => {
    return orgService.saveConfig(orgId, { formasPagoIds: ids });
  },

};
