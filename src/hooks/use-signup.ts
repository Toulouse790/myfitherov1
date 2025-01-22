import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SignUpParams {
  email: string;
  password: string;
  pseudo: string;
}

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const signUp = async ({ email, password, pseudo }: SignUpParams) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1) Créer l'utilisateur (email, mdp) dans Supabase
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      // 2) Récupérer l'ID de l'utilisateur créé
      const userId = signUpData.user?.id;
      if (!userId) {
        throw new Error("Impossible de récupérer l'ID utilisateur.");
      }

      // 3) Enregistrer le pseudo + email dans la table "profiles"
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          pseudo,
          email,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      // 4) Afficher un toast de succès
      toast({
        title: "Création de compte réussie",
        description: "Votre compte a bien été créé.",
      });

      return true;
    } catch (err) {
      console.error("SignUp error:", err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la création du compte.";
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Erreur de création de compte",
        description: errorMsg,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    isLoading,
    error,
  };
};