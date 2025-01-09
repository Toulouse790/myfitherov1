import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Stocker le chemin actuel uniquement s'il ne s'agit pas déjà de /signin
    if (location.pathname !== "/signin") {
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
    }
    return <Navigate to="/signin" replace />;
  }

  // Si l'utilisateur est connecté et essaie d'accéder à /signin, le rediriger vers /
  if (location.pathname === "/signin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};