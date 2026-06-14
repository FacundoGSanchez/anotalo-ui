import { useState, useEffect } from "react";
import { authService } from "../services/authService";

export function useCurrentOrg() {
  const [orgId, setOrgId] = useState(() => authService.getCurrentOrgId());

  useEffect(() => {
    const handler = () => setOrgId(authService.getCurrentOrgId());
    window.addEventListener("org-changed", handler);
    return () => window.removeEventListener("org-changed", handler);
  }, []);

  return orgId;
}
