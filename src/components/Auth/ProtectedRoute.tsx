
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { debugLogger } from "@/utils/debug-logger";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/loader";

export const ProtectedRoute = () => {
  const { user, loading, session } = useAuth();
  const location = useLocation();

  useEffect(() => {
    debugLogger.log("ProtectedRoute", "Route protection check", { 
      isAuthenticated: !!user, 
      hasValidSession: !!session,
      isLoading: loading,
      currentPath: location.pathname 
    });

    if (!loading && !user && !session) {
      debugLogger.warn("ProtectedRoute", "Non authentifié, redirection vers connexion", {
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

  if (!user || !session) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};
