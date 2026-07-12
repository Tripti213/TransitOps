import api from "./api";
import type { User } from "../types/auth";

interface AuthResponse {
  success: boolean;
  user: User;
  message?: string;
}

export const login = (email: string, password: string) =>
  api.post<AuthResponse>("/auth/login", { email, password }).then((res) => res.data.user);

export const logout = () => api.post("/auth/logout");

export const getMe = () => api.get<AuthResponse>("/auth/me").then((res) => res.data.user);
