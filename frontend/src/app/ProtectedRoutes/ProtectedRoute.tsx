import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}