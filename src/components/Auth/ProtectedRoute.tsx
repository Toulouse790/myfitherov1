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
    const checkSession = async () => {
      try {
        // Vérifier d'abord la session en cours
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Session active trouvée");
          setIsAuthenticated(true);
          return;
        }

        // Si pas de session active, vérifier le stockage local
        const savedSession = localStorage.getItem('myfithero-auth');
        if (savedSession) {
          console.log("Session sauvegardée trouvée, tentative de restauration");
          try {
            const parsedSession = JSON.parse(savedSession);
            if (parsedSession?.access_token) {
              const { data: { session: restoredSession }, error } = 
                await supabase.auth.setSession(parsedSession);
              
              if (!error && restoredSession) {
                console.log("Session restaurée avec succès");
                setIsAuthenticated(true);
                return;
              } else {
                console.error("Erreur lors de la restauration de la session:", error);
                localStorage.removeItem('myfithero-auth');
              }
            }
          } catch (parseError) {
            console.error("Erreur lors du parsing de la session:", parseError);
            localStorage.removeItem('myfithero-auth');
          }
        }

        console.log("Aucune session valide trouvée");
        setIsAuthenticated(false);
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error);
        setIsAuthenticated(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Changement d'état d'authentification:", event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        localStorage.removeItem('myfithero-auth');
        toast({
          title: "Déconnexion",
          description: "Vous avez été déconnecté avec succès",
        });
      } else if (session) {
        setIsAuthenticated(true);
        if (location.pathname === '/signin') {
          console.log("Redirection depuis signin car déjà authentifié");
        }
        localStorage.setItem('myfithero-auth', JSON.stringify(session));
      }
    });

    return () => subscription.unsubscribe();
  }, [toast, location.pathname]);

  // Pendant la vérification initiale
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Définir les routes publiques
  const publicRoutes = ["/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Gérer la logique de redirection
  if (!isAuthenticated && !isPublicRoute) {
    console.log("Redirection vers signin - Non authentifié sur route protégée", {
      from: location.pathname,
      state: location.state
    });
    return <Navigate to="/signin" state={{ from: location, workoutPlan: location.state?.workoutPlan }} replace />;
  }

  if (isAuthenticated && isPublicRoute) {
    console.log("Redirection vers home - Authentifié sur route publique");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};