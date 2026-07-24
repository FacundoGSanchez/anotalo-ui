import React from "react";
import { FORMAS_PAGO, FORMAS_PAGO_DEFAULT, ICONOS_POS, RUBROS_DEFAULT } from "../constants/posConstants";
import type { OrgConfig, Rubro } from "@/types/organization";
import type { FormaPagoConfig, ServiceResult } from "@/types/common";
import type { FormaPagoItem } from "@/types/common";

const getConfigKey = (orgId: number | null): string => `org_config_${orgId || "default"}`;

const TIPOS_MOVIMIENTO: string[] = ["Venta", "Pago"];

const MERGE_PROPS: string[] = ["icon", "color", "requiereEntidad", "impactaCaja", "impactaCtaCte"];

const resolveIcon = (iconKey: string | undefined, fallback: React.ReactNode | null): React.ReactNode | null => {
  if (!iconKey) return fallback ?? null;
  const IconComponent = ICONOS_POS[iconKey as keyof typeof ICONOS_POS];
  if (!IconComponent) return fallback ?? null;
  return React.createElement(IconComponent);
};

interface OrgFormaPagoItem {
  nombre?: string;
  sigla?: string;
  key?: string;
  label?: string;
  iconKey?: string;
  enabled?: boolean;
  requiereEntidad?: boolean;
  impactaCaja?: boolean;
  impactaCtaCte?: boolean;
  [key: string]: unknown;
}

const mergeWithDefault = (orgFormas: OrgFormaPagoItem[]): FormaPagoItem[] => {
  return (orgFormas || [])
    .filter((f) => f.enabled !== false)
    .map((f) => {
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

      const defaultOpt = FORMAS_PAGO.find((dp) => dp.key === f.key);
      const merged: Record<string, unknown> = {
        key: f.key,
        label: f.label || f.key,
      };
      MERGE_PROPS.forEach((prop) => {
        merged[prop] = f[prop] ?? (defaultOpt as unknown as Record<string, unknown>)?.[prop] ?? null;
      });
      merged.icon = resolveIcon(f.iconKey, merged.icon as React.ReactNode | null);
      return merged as unknown as FormaPagoItem;
    });
};

export const orgService = {
  getConfig: (orgId: number | null): OrgConfig => {
    try {
      const raw = localStorage.getItem(getConfigKey(orgId));
      return raw ? (JSON.parse(raw) as OrgConfig) : {};
    } catch {
      return {};
    }
  },

  saveConfig: (orgId: number | null, data: Partial<OrgConfig>): ServiceResult => {
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

  initOrgConfig: (orgId: number, config: Record<string, unknown>): void => {
    const existing = orgService.getConfig(orgId);
    if (!existing.formasPago && config?.formasPago) {
      orgService.saveConfig(orgId, { formasPago: config.formasPago as OrgConfig["formasPago"] });
    }
  },

  getRubros: (orgId: number | null): Rubro[] => {
    const config = orgService.getConfig(orgId);
    return config.rubros && config.rubros.length > 0 ? config.rubros : [];
  },

  saveRubros: (orgId: number | null, rubros: Rubro[]): ServiceResult => {
    return orgService.saveConfig(orgId, { rubros });
  },

  getConfigPOS: (orgId: number | null): { usaRubro: boolean } => {
    const config = orgService.getConfig(orgId);
    return config.configPOS || { usaRubro: false };
  },

  saveConfigPOS: (orgId: number | null, configPOS: { usaRubro: boolean }): ServiceResult => {
    return orgService.saveConfig(orgId, { configPOS });
  },

  getFormasPago: (orgId: number | null, tipo: string): FormaPagoItem[] => {
    const config = orgService.getConfig(orgId);
    const formasPorTipo = (config.formasPago as Record<string, OrgFormaPagoItem[]> | undefined)?.[tipo];

    if (formasPorTipo && formasPorTipo.length > 0) {
      return mergeWithDefault(formasPorTipo);
    }

    if (config.formasPago && !Array.isArray(config.formasPago)) {
      for (const t of TIPOS_MOVIMIENTO) {
        const fps = (config.formasPago as unknown as Record<string, OrgFormaPagoItem[]>)[t];
        if (fps && fps.length > 0) {
          return mergeWithDefault(fps);
        }
      }
    }

    return mergeWithDefault(FORMAS_PAGO_DEFAULT as unknown as OrgFormaPagoItem[]);
  },

  getFormasPagoDefault: (): FormaPagoConfig[] => FORMAS_PAGO_DEFAULT,

  getFormasPagoIds: (orgId: number | null): FormaPagoConfig[] => {
    const config = orgService.getConfig(orgId);
    return config.formasPagoIds || [];
  },

  saveFormasPagoIds: (orgId: number | null, ids: FormaPagoConfig[]): ServiceResult => {
    return orgService.saveConfig(orgId, { formasPagoIds: ids });
  },

};
