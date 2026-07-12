/**
 * TEMPORARY MOCK AUTH — replace internals once real login/OAuth is wired up.
 *
 * Keep the exported shape identical (AuthProvider, useAuth, AuthContext) so
 * routing/layout/pages built against it don't need to change. The real
 * implementation should:
 *  - on mount, check localStorage/cookies for a token and validate/fetch the user
 *  - `login()` should call the auth API, store the token, and set `user`
 *  - `logout()` should clear the token and `user`
 *
 * For now this auto-logs-in a fake Fleet Manager so the rest of the app is
 * buildable/testable without waiting on the auth flow.
 */
import { createContext, useContext, useState, type ReactNode } from "react";
import { ROLES, type RoleName } from "../constants/roles";
import type { User, AuthContextType } from "../types/auth";

const MOCK_USER: User = {
  id: "mock-user-1",
  name: "Priya Sharma",
  email: "fleetmanager@transitops.com",
  role: ROLES.FLEET_MANAGER,
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO(auth): replace with real state driven by login API / stored token.
  const [user] = useState<User | null>(MOCK_USER);
  const [loading] = useState(false);

  const login = async (_email: string, _password: string) => {
    // TODO(auth): call POST /auth/login, store token, setUser(response.user)
    console.warn("AuthContext.login() is a stub — real auth not wired up yet.");
  };

  const logout = () => {
    // TODO(auth): clear token/localStorage, setUser(null)
    console.warn("AuthContext.logout() is a stub — real auth not wired up yet.");
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
