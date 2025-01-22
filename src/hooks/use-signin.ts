import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (username: string, password: string, rememberMe: boolean) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Get email from username
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", username)
        .single();

      if (fetchError || !profile?.email) {
        throw new Error("Aucun compte trouvé avec ce nom d'utilisateur.");
      }

      // 2. Sign in with email
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      if (signInError) throw signInError;

      toast({
        title: "Connexion réussie",
        description: `Bienvenue sur MyFitHero, ${username} !`,
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
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn, isLoading, error };
};