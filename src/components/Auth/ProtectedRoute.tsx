import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Pendant le chargement, on peut afficher un loader ou rien
  if (loading) {
    return null;
  }

  // Une fois le chargement terminé, on redirige si pas d'utilisateur
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};