
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignUp = async (email: string, password: string, pseudo: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Vérifier si l'email existe déjà
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        toast({
          title: "Erreur",
          description: "Cet email est déjà utilisé",
          variant: "destructive",
        });
        return false;
      }

      // 2. Créer le nouvel utilisateur
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            pseudo: pseudo,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 3. Immédiatement connecter l'utilisateur
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      // 4. Attendre que le trigger crée le profil
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 5. Vérifier que le profil a été créé
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', signUpData.user?.id)
        .single();

      if (profileError || !profile) {
        throw new Error("Erreur lors de la création du profil");
      }

      toast({
        title: "Succès",
        description: "Compte créé et connecté avec succès",
      });

      return true;

    } catch (err) {
      if (err instanceof AuthError) {
        throw err;
      }
      console.error("Sign up error:", err);
      throw new Error("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignUp, isLoading, error };
};
