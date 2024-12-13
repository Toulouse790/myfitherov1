import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Vérification initiale de la session
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      console.log("Initial auth check:", { hasSession: !!session });
    };

    checkInitialSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", { event, hasSession: !!session });
      setIsAuthenticated(!!session);

      // Afficher une notification lors de la déconnexion
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Déconnexion",
          description: "Vous avez été déconnecté avec succès",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  // Pendant la vérification initiale
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Routes publiques (signin/signup)
  const publicRoutes = ["/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Si non authentifié et sur une route protégée
  if (!isAuthenticated && !isPublicRoute) {
    console.log("Redirecting to signin:", { from: location.pathname });
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Si authentifié et sur une route publique
  if (isAuthenticated && isPublicRoute) {
    console.log("Redirecting to home: user is authenticated");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};