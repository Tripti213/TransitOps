import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { RoleName } from "../constants/roles";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: RoleName[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">Loading...</div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !hasRole(...allowedRoles)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
