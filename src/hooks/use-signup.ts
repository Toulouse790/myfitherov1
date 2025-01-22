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

      // 1. Vérifier si l'utilisateur est déjà connecté
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.auth.signOut();
      }

      // 2. Vérifier si le pseudo existe déjà
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("pseudo")
        .eq("pseudo", pseudo)
        .maybeSingle();

      if (profileError) {
        console.error("Erreur lors de la vérification du pseudo:", profileError);
        throw new Error("Erreur lors de la vérification du pseudo");
      }

      if (existingProfile) {
        throw new Error("Ce pseudo est déjà utilisé");
      }

      // 3. Créer l'utilisateur avec les métadonnées
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            pseudo: pseudo
          }
        }
      });

      if (signUpError) throw signUpError;

      const userId = signUpData.user?.id;
      if (!userId) throw new Error("Impossible de récupérer l'ID utilisateur");

      // 4. Créer le profil
      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          pseudo: pseudo,
          email: email,
        });

      if (upsertError) throw upsertError;

      toast({
        title: "Succès",
        description: "Inscription réussie! Vous êtes maintenant connecté.",
      });

      return true;

    } catch (err) {
      console.error("SignUp error:", err);
      const errorMsg = err instanceof Error ? err.message : "Une erreur est survenue lors de la création du compte.";
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