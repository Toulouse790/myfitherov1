import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Inscription réussie",
        description: "Bienvenue sur MyFitHero !",
      });

      // Redirection vers le questionnaire initial
      navigate("/initial-questionnaire");
      return true;

    } catch (err) {
      console.error("Sign up error:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription");
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignUp, isLoading, error };
};