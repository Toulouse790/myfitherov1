
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { debugLogger } from "@/utils/debug-logger";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    debugLogger.log("ProtectedRoute", "Route protection check", { 
      isAuthenticated: !!user, 
      isLoading: loading,
      currentPath: location.pathname 
    });
  }, [user, loading, location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    debugLogger.warn("ProtectedRoute", "Non authentifié, redirection vers connexion", {
      from: location.pathname
    });
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};
