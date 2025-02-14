
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { handleSignupError } from "@/utils/auth-errors";

async function genererUsernameUnique(username: string): Promise<string> {
  let usernameOriginal = username;
  let compteur = 1;

  while (await usernameExiste(username)) {
    username = `${usernameOriginal}_${compteur}`;
    compteur++;
  }

  return username;
}

async function usernameExiste(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error('Erreur lors de la vérification du username:', error);
    throw error;
  }

  return !!data;
}

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignUp = async (email: string, password: string, username: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Début de l\'inscription pour:', { email, username });

      // 1. Vérifier si l'email existe déjà
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Erreur",
          description: "Un compte existe déjà avec cet email",
          variant: "destructive",
        });
        return false;
      }

      // 2. Générer un username unique
      const usernameUnique = await genererUsernameUnique(username);
      if (usernameUnique !== username) {
        toast({
          title: "Information",
          description: `Le nom d'utilisateur ${username} est déjà utilisé. Nous vous proposons ${usernameUnique}`,
        });
      }

      console.log('Username unique généré:', usernameUnique);

      // 3. Créer l'utilisateur avec les métadonnées
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: usernameUnique,
          },
        },
      });

      if (signUpError) {
        console.error('Erreur lors de l\'inscription:', signUpError);
        if (signUpError.message.includes("User already registered")) {
          toast({
            title: "Erreur",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
            variant: "destructive",
          });
          return false;
        }
        throw signUpError;
      }

      // 4. Vérifier que l'inscription a réussi
      if (!signUpData.user) {
        throw new Error("L'inscription a échoué");
      }

      console.log('Inscription réussie:', signUpData);

      // 5. Succès
      toast({
        title: "Succès",
        description: "Compte créé avec succès !",
      });

      return true;

    } catch (err) {
      console.error("Erreur d'inscription:", err);
      
      if (err instanceof AuthError) {
        const errorMessage = handleSignupError(err);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'inscription",
          variant: "destructive",
        });
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignUp, isLoading, error };
};
