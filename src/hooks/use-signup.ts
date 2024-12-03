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
        return { error };
      }

      if (data) {
        toast({
          title: "Bienvenue !",
          description: `${username}, bienvenue dans cette belle aventure ! Configurons ensemble vos préférences.`,
          duration: 5000,
        });

        onSuccess?.();
        setTimeout(() => {
          navigate("/initial-questionnaire");
        }, 2000);
      }

      return { data };
    } catch (error: any) {
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