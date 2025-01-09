import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Si l'utilisateur n'est pas connecté et n'est pas déjà sur /signin
  if (!user && location.pathname !== "/signin") {
    return <Navigate to="/signin" replace />;
  }

  // Si l'utilisateur est connecté et essaie d'accéder à /signin
  if (user && location.pathname === "/signin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};