import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/stores/auth.store";

type PrivateRouteProps = { children: ReactNode };

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}