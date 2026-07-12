import type { RoleName } from "../constants/roles";

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: RoleName[]) => boolean;
}
