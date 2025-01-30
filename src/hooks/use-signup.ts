import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError } from "@supabase/supabase-js";

export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

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