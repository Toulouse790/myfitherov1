
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      debugLogger.log('SignIn', 'Tentative de connexion avec:', { email });

      // Vérification de la connexion à Supabase avant tentative de connexion
      const connectionTest = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      if (connectionTest.error) {
        debugLogger.error('SignIn', 'Erreur de connexion à Supabase:', connectionTest.error);
        throw new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        debugLogger.error('SignIn', 'Erreur lors de la connexion:', signInError);
        
        // Messages d'erreur plus précis selon le type d'erreur
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Email ou mot de passe incorrect");
        } else if (signInError.message.includes("Email not confirmed")) {
          throw new Error("Email non confirmé. Veuillez vérifier votre boîte mail");
        } else {
          throw signInError;
        }
      }

      if (!data.session) {
        debugLogger.error('SignIn', 'Aucune session créée après connexion');
        throw new Error('Aucune session créée après connexion');
      }

      debugLogger.log('SignIn', 'Connexion réussie:', { 
        userId: data.user?.id,
        hasSession: !!data.session 
      });

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur MyFitHero !",
      });

      return true;

    } catch (err) {
      debugLogger.error("SignIn", "Erreur lors de la connexion:", err);
      const errorMessage = err instanceof Error ? err.message : "Email ou mot de passe incorrect";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn, isLoading, error };
};
