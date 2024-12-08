import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Vérifier la session initiale
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial session check:", !!session);
      setIsAuthenticated(!!session);
    };

    checkSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", !!session);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Afficher le loader pendant la vérification
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Si non authentifié et pas sur signin/signup, rediriger vers signin
  if (!isAuthenticated && !["/signin", "/signup"].includes(location.pathname)) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Si authentifié et sur signin/signup, rediriger vers la page d'accueil
  if (isAuthenticated && ["/signin", "/signup"].includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};