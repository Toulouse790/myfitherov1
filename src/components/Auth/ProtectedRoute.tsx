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
    // Initial session check
    const checkInitialSession = async () => {
      try {
        // Try to recover session from storage first
        const savedSession = localStorage.getItem('myfithero-auth');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          if (session?.access_token) {
            // Set the session in Supabase
            await supabase.auth.setSession(session);
            setIsAuthenticated(true);
            return;
          }
        }

        // If no saved session, check with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        console.log("Initial auth check:", { hasSession: !!session });
      } catch (error) {
        console.error("Session check error:", error);
        setIsAuthenticated(false);
      }
    };

    checkInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", { event, hasSession: !!session });
      
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        localStorage.removeItem('myfithero-auth');
        toast({
          title: "Déconnexion",
          description: "Vous avez été déconnecté avec succès",
        });
      } else if (session) {
        setIsAuthenticated(true);
        // Save session to localStorage if it exists
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

  // Public routes (signin/signup)
  const publicRoutes = ["/signin", "/signup"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // If not authenticated and on a protected route
  if (!isAuthenticated && !isPublicRoute) {
    console.log("Redirecting to signin:", { from: location.pathname });
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If authenticated and on a public route
  if (isAuthenticated && isPublicRoute) {
    console.log("Redirecting to home: user is authenticated");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};