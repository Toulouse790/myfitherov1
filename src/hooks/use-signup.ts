import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { handleSignupError } from "@/utils/auth-errors";

interface UseSignupProps {
  onSuccess?: () => void;
}

export const useSignup = ({ onSuccess }: UseSignupProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    console.log("Début de l'inscription...");

    try {
      // First, check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking username:", checkError);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier la disponibilité du nom d'utilisateur",
          variant: "destructive",
        });
        return { error: checkError };
      }

      if (existingUser) {
        console.log("Username already taken");
        toast({
          title: "Erreur",
          description: "Ce nom d'utilisateur est déjà pris",
          variant: "destructive",
        });
        return { error: new Error("Username already taken") };
      }

      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      console.log("Réponse de Supabase:", { data, error: signupError });

      if (signupError) {
        if (signupError.message.includes("User already registered")) {
          console.log("Utilisateur déjà inscrit, redirection vers la connexion");
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec cet email",
            variant: "destructive",
          });
          navigate("/signin");
          return { error: null };
        }

        const errorMessage = handleSignupError(signupError);
        console.error("Erreur lors de l'inscription:", signupError);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
        return { error: signupError };
      }

      if (data?.user) {
        console.log("Inscription réussie !");
        console.log("Signup successful, profile will be created by trigger");
        toast({
          title: "Bienvenue !",
          description: `${username}, bienvenue dans cette belle aventure ! Configurons ensemble vos préférences.`,
          duration: 5000,
        });

        onSuccess?.();
        navigate("/initial-questionnaire");
      }

      return { data };
    } catch (error: any) {
      console.error("Erreur inattendue:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue lors de l'inscription",
        variant: "destructive",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signup,
    isLoading,
  };
};