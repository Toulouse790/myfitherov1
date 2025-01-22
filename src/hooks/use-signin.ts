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

      // Vérifier si le profil existe et a un pseudo
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('pseudo')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profileError || !profile.pseudo) {
        // Mettre à jour le profil avec l'email comme pseudo si nécessaire
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ pseudo: email.split('@')[0] })
          .eq('id', (await supabase.auth.getUser()).data.user?.id);

        if (updateError) throw updateError;
      }

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