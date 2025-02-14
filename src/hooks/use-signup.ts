
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";
import { handleSignupError } from "@/utils/auth-errors";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignUp = async (email: string, password: string, pseudo: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Vérifier d'abord si l'utilisateur existe déjà dans auth.users
      const { data: signUpCheckData, error: signUpCheckError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            pseudo: pseudo,
          },
        },
      });

      if (signUpCheckError) {
        if (signUpCheckError.message.includes("User already registered")) {
          toast({
            title: "Erreur",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
            variant: "destructive",
          });
          return false;
        }
        throw signUpCheckError;
      }

      // 2. Une fois l'utilisateur créé, vérifier le profil
      const { data: profileCheck, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', signUpCheckData.user?.id)
        .single();

      if (profileCheckError || !profileCheck) {
        throw new Error("Erreur lors de la création du profil");
      }

      toast({
        title: "Succès",
        description: "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
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
