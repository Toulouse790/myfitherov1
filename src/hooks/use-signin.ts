import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur MyFitHero !",
      });

      navigate("/");

    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn, isLoading, error };
};