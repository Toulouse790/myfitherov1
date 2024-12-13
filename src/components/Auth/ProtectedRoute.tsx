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
        // Check saved session first
        const savedSession = localStorage.getItem('myfithero-auth');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          if (session?.access_token) {
            await supabase.auth.setSession(session);
            setIsAuthenticated(true);
            return;
          }
        }

        // If no saved session, check with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        localStorage.removeItem('myfithero-auth');
        toast({
          title: "Déconnexion",
          description: "Vous avez été déconnecté avec succès",
        });
      } else if (session) {
        setIsAuthenticated(true);
        localStorage.setItem('myfithero-auth', JSON.stringify(session));
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  // During initial check
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Define public routes
  const publicRoutes = ["/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Handle routing logic
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (isAuthenticated && isPublicRoute) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};