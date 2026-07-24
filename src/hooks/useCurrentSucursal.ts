import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useCurrentOrg } from "./useCurrentOrg";
import type { Sucursal, UsuarioSucursal } from "@/types";

interface UseCurrentSucursalResult {
  sucursalId: number | null;
  sucursal: Sucursal | null;
  sucursales: UsuarioSucursal[];
}

export function useCurrentSucursal(): UseCurrentSucursalResult {
  const orgId = useCurrentOrg();
  const { session } = useAuth();
  const [sucursalId, setSucursalId] = useState<number | null>(() => authService.getCurrentSucursalId());

  useEffect(() => {
    const handler = (): void => setSucursalId(authService.getCurrentSucursalId());
    window.addEventListener("sucursal-changed", handler);
    return () => window.removeEventListener("sucursal-changed", handler);
  }, []);

  useEffect(() => {
    const current = authService.getCurrentSucursalId();
    const sucursales = session?.sucursales?.filter((s) => s.organizacionId === orgId) || [];
    const defaultId = session?.organizaciones?.find((o) => o.id === orgId)?.sucursalDefault;

    if (current && sucursales.some((s) => s.id === current)) return;

    const fallback = defaultId || sucursales[0]?.id || null;
    if (fallback && fallback !== current) {
      authService.switchSucursal(fallback);
    }
    setSucursalId(fallback);
  }, [orgId, session]);

  const sucursales: UsuarioSucursal[] = session?.sucursales?.filter((s) => s.organizacionId === orgId) || [];
  const sucursal: Sucursal | null = sucursales.find((s) => s.id === sucursalId) || null;

  return { sucursalId, sucursal, sucursales };
}
