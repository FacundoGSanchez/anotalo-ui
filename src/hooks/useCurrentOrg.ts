import { useState, useEffect } from "react";
import { authService } from "../services/authService";

export function useCurrentOrg(): number | null {
  const [orgId, setOrgId] = useState<number | null>(() => authService.getCurrentOrgId());

  useEffect(() => {
    const handler = (): void => setOrgId(authService.getCurrentOrgId());
    window.addEventListener("org-changed", handler);
    return () => window.removeEventListener("org-changed", handler);
  }, []);

  return orgId;
}
