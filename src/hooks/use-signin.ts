import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // Check if user needs to complete questionnaire
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user?.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error checking profile:", profileError);
      }

      const { data: questionnaireResponse } = await supabase
        .from("questionnaire_responses")
        .select("id")
        .eq("user_id", data.user?.id)
        .maybeSingle();

      if (!questionnaireResponse) {
        navigate("/initial-questionnaire");
      } else {
        navigate("/");
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur MyFitHero !",
        });
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn, isLoading, error };
};