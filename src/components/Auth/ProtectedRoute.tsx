import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("Auth state changed:", event, !!session);
          setIsAuthenticated(!!session);
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error checking auth:", error);
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Une erreur est survenue lors de la vérification de votre session.",
        });
      }
    };

    checkAuth();
  }, [toast]);

  // Show loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we're on the signin page and already authenticated, redirect to home
  if (isAuthenticated && location.pathname === "/signin") {
    return <Navigate to="/" replace />;
  }

  // If not authenticated and not on signin page, redirect to signin
  if (!isAuthenticated && location.pathname !== "/signin") {
    // Store the current path for redirect after login
    sessionStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};