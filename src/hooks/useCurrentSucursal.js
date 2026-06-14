import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useCurrentOrg } from "./useCurrentOrg";

export function useCurrentSucursal() {
  const orgId = useCurrentOrg();
  const { session } = useAuth();
  const [sucursalId, setSucursalId] = useState(() => authService.getCurrentSucursalId());

  useEffect(() => {
    const handler = () => setSucursalId(authService.getCurrentSucursalId());
    window.addEventListener("sucursal-changed", handler);
    return () => window.removeEventListener("sucursal-changed", handler);
  }, []);

  // Reset sucursal when org changes (invalid or no stored sucursal)
  useEffect(() => {
    const current = authService.getCurrentSucursalId();
    const sucursales = session?.sucursales?.filter((s) => s.organizacionId === orgId) || [];
    const defaultId = session?.organizaciones?.find((o) => o.id === orgId)?.sucursalDefault;

    if (current && sucursales.some((s) => s.id === current)) return; // already valid

    const fallback = defaultId || sucursales[0]?.id || null;
    if (fallback && fallback !== current) {
      authService.switchSucursal(fallback);
    }
    setSucursalId(fallback);
  }, [orgId, session]);

  const sucursales = session?.sucursales?.filter((s) => s.organizacionId === orgId) || [];
  const sucursal = sucursales.find((s) => s.id === sucursalId) || null;

  return { sucursalId, sucursal, sucursales };
}
