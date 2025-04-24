
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { authLogger } from "@/utils/auth-logger";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshAuth = useCallback(async () => {
    try {
      authLogger.info("Rafraîchissement de l'authentification...");
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        authLogger.error("Erreur lors du rafraîchissement de la session:", error);
        return;
      }
      
      if (data.session) {
        authLogger.success("Session rafraîchie avec succès");
        setSession(data.session);
        setUser(data.session.user);
      } else {
        authLogger.warn("Aucune session active après rafraîchissement");
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      authLogger.error("Exception lors du rafraîchissement de l'authentification:", error);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });

      return { error: null };
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message,
      });
      return { error };
    }
  };

  const signOut = useCallback(async () => {
    try {
      authLogger.info("Déconnexion...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      authLogger.success("Déconnexion réussie");
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      authLogger.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
      });
    }
  }, [toast]);

  useEffect(() => {
    // Configuration initiale de l'authentification
    const initializeAuth = async () => {
      try {
        authLogger.info("Initialisation de l'authentification...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          setUser(session.user);
          authLogger.success("Session existante récupérée");
        }
      } catch (error) {
        authLogger.error("Erreur lors de l'initialisation:", error);
      } finally {
        setLoading(false);
      }
    };

    // Configurer l'écouteur d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      authLogger.info("Changement d'état d'authentification:", { event });
      
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        authLogger.trace("Session mise à jour", {
          userId: newSession.user.id,
          event
        });
      } else {
        setSession(null);
        setUser(null);
        authLogger.debug("Session terminée");
      }
    });

    initializeAuth();

    // Nettoyage
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signIn, 
      signOut, 
      refreshAuth 
    }}>
      {children}
    </AuthProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
