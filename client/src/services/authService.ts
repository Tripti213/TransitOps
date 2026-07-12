import api from "./api";
import type { User } from "../types/auth";
import type { RoleName } from "../constants/roles";

interface AuthResponse {
  success: boolean;
  user: User;
  message?: string;
}

export const login = (email: string, password: string, role: RoleName) =>
  api.post<AuthResponse>("/auth/login", { email, password, role }).then((res) => res.data.user);

export const logout = () => api.post("/auth/logout");

export const getMe = () => api.get<AuthResponse>("/auth/me").then((res) => res.data.user);
