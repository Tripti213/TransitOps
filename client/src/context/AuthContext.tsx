import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { RoleName } from "../constants/roles";
import type { User, AuthContextType } from "../types/auth";
import * as authService from "../services/authService";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setUser(await authService.login(email, password));
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const hasRole = (...roles: RoleName[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
