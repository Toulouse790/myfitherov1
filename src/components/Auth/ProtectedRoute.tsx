import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Vérification de l'authentification...");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Session trouvée:", !!session);
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Changement d'état d'authentification:", { event, hasSession: !!session });
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("Utilisateur non authentifié, redirection vers /signin");
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};