import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UseSignupProps {
  onSuccess?: () => void;
}

export const useSignup = ({ onSuccess }: UseSignupProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const signup = async (email: string, password: string, username: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec cet email",
            variant: "destructive",
          });
          navigate("/signin");
          return { error: null };
        }
        return { error };
      }

      if (data) {
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
      toast({
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
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