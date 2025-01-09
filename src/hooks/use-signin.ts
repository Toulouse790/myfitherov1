import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.message) {
        case "Invalid login credentials":
          return "Email ou mot de passe incorrect";
        case "Email not confirmed":
          return "Veuillez confirmer votre email avant de vous connecter";
        case "Invalid password":
          return "Le mot de passe doit contenir au moins 6 caractères";
        default:
          return "Une erreur est survenue lors de la connexion";
      }
    }
    return error.message;
  };

  const handleSignIn = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!password || password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
        setIsLoading(false);
        return;
      }

      console.log("=== DÉBUT DE LA TENTATIVE DE CONNEXION ===");
      console.log({
        email: email,
        passwordLength: password.length,
        rememberMe: rememberMe,
        timestamp: new Date().toISOString(),
        location: window.location.href
      });

      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("=== ERREUR DE CONNEXION ===");
        console.error({
          message: signInError.message,
          code: signInError.status,
          name: signInError.name,
          timestamp: new Date().toISOString()
        });
        
        const errorMessage = getErrorMessage(signInError);
        setError(errorMessage);
        return;
      }

      console.log("=== CONNEXION RÉUSSIE ===");
      console.log({
        userId: data.session?.user.id,
        email: data.session?.user.email,
        rememberMe: rememberMe,
        timestamp: new Date().toISOString()
      });

      if (rememberMe && data.session) {
        console.log("=== SAUVEGARDE DE LA SESSION ===");
        localStorage.setItem('myfithero-auth', JSON.stringify(data.session));
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur MyFitHero !",
      });

      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("=== ERREUR INATTENDUE ===");
      console.error({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      setError("Une erreur inattendue est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleSignIn
  };
};