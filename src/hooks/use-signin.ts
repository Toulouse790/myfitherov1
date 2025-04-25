
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToastWithTranslation } from "@/hooks/use-toast-with-translation";
import { debugLogger } from "@/utils/debug-logger";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toastFromKey } = useToastWithTranslation();

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
          // Vérifier si l'utilisateur existe
          const { data: userExists } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle();
            
          if (!userExists) {
            throw new Error("Aucun compte n'existe avec cet email. Voulez-vous vous inscrire?");
          } else {
            throw new Error("Mot de passe incorrect. Veuillez réessayer.");
          }
        } else if (signInError.message.includes("Email not confirmed")) {
          throw new Error("Email non confirmé. Veuillez vérifier votre boîte mail");
        } else if (signInError.message.includes("rate limited")) {
          throw new Error("Trop de tentatives. Veuillez réessayer dans quelques minutes.");
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

      // On ne fait pas de toast ici car il sera fait dans le hook useAuth via l'événement onAuthStateChange
      return true;

    } catch (err) {
      debugLogger.error("SignIn", "Erreur lors de la connexion:", err);
      const errorMessage = err instanceof Error ? err.message : "Email ou mot de passe incorrect";
      setError(errorMessage);
      toastFromKey('auth.loginError', 'auth.errors.invalidCredentials', { variant: "destructive" });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignIn, isLoading, error };
};
