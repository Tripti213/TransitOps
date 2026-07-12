import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { RoleName } from "../constants/roles";
import { DEFAULT_PERMISSIONS, type RolePermissions } from "../constants/navigation";

const STORAGE_KEY = "transitops.rolePermissions";

interface PermissionsContextType {
  permissions: RolePermissions;
  isVisible: (role: RoleName, tabKey: string) => boolean;
  savePermissions: (next: RolePermissions) => void;
  resetToDefaults: () => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

const loadPermissions = (): RolePermissions => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // malformed storage — fall back to defaults
  }
  return DEFAULT_PERMISSIONS;
};

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<RolePermissions>(loadPermissions);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions));
  }, [permissions]);

  const isVisible = (role: RoleName, tabKey: string) => permissions[role]?.includes(tabKey) ?? false;

  const savePermissions = (next: RolePermissions) => setPermissions(next);

  const resetToDefaults = () => setPermissions(DEFAULT_PERMISSIONS);

  return (
    <PermissionsContext.Provider value={{ permissions, isVisible, savePermissions, resetToDefaults }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
}
