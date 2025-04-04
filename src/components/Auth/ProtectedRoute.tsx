
import { useEffect, ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { debugLogger } from "@/utils/debug-logger";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children?: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    debugLogger.log("ProtectedRoute", "Vérification de l'authentification:", { 
      isAuthenticated: !!user, 
      isLoading: loading,
      path: location.pathname 
    });
  }, [user, loading, location]);

  // Afficher un spinner pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!user) {
    debugLogger.warn("ProtectedRoute", "Utilisateur non authentifié, redirection vers la connexion", {
      from: location.pathname
    });
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  // Rendre les routes enfants si authentifié
  debugLogger.log("ProtectedRoute", "Utilisateur authentifié, accès autorisé");
  return children ? <>{children}</> : <Outlet />;
};
