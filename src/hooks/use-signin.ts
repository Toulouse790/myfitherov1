import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // Récupérer l'URL de redirection stockée
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin'); // Nettoyer après utilisation

      // Afficher un toast de succès
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur MyFitHero !",
      });

      // Rediriger vers la page précédente ou la page d'accueil
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn, isLoading, error };
};