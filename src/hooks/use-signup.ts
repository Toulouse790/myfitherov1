
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { handleSignupError } from "@/utils/auth-errors";

async function genererPseudoUnique(pseudo: string): Promise<string> {
  let pseudoOriginal = pseudo;
  let compteur = 1;

  while (await pseudoExiste(pseudo)) {
    pseudo = `${pseudoOriginal}_${compteur}`;
    compteur++;
  }

  return pseudo;
}

async function pseudoExiste(pseudo: string): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('pseudo', pseudo)
    .maybeSingle();

  return !!data;
}

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignUp = async (email: string, password: string, pseudo: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Vérifier et générer un pseudo unique
      const pseudoUnique = await genererPseudoUnique(pseudo);
      if (pseudoUnique !== pseudo) {
        toast({
          title: "Information",
          description: `Le pseudo ${pseudo} est déjà utilisé. Nous vous proposons ${pseudoUnique}`,
        });
      }

      // 2. Créer l'utilisateur avec les métadonnées
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            pseudo: pseudoUnique,
          },
        },
      });

      if (signUpError) {
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

      // 3. Vérifier que le profil a bien été créé
      if (signUpData.user) {
        const { data: profileCheck, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', signUpData.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Erreur lors de la vérification du profil:", profileError);
          // On ne lève pas l'erreur ici car le trigger devrait gérer la création
        }

        // 4. Création réussie
        toast({
          title: "Succès",
          description: "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
        });

        return true;
      }

      return false;

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
