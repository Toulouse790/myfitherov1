
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { debugLogger } from "@/utils/debug-logger";
import { useAuth } from "@/hooks/use-auth";
import { Loader } from "@/components/ui/loader";

export const ProtectedRoute = () => {
  const { user, loading, session } = useAuth();
  const location = useLocation();

  useEffect(() => {
    debugLogger.log("ProtectedRoute", "Vérification de l'accès", { 
      isAuthenticated: !!user, 
      hasValidSession: !!session,
      isLoading: loading,
      currentPath: location.pathname 
    });

    if (!loading && !user && !session) {
      debugLogger.warn("ProtectedRoute", "Accès non autorisé, redirection vers connexion", {
        from: location.pathname
      });
    }
  }, [user, loading, location, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8" />
        <span className="ml-2 text-muted-foreground">Vérification de l'authentification...</span>
      </div>
    );
  }

  // Si pas d'utilisateur authentifié, rediriger vers la page de connexion
  // en gardant l'URL actuelle en paramètre pour revenir après connexion
  if (!user || !session) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  // Si authentifié, autoriser l'accès aux routes protégées
  return <Outlet />;
};
