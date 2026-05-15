import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";

export function StoreProtectedRoute() {
  const { isAuthenticated, isAuthenticatedStroe } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticatedStroe) {
    return <Navigate to="/choose" replace />;
  }

  return <Outlet />;
}