
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { authLogger } from "@/utils/auth-logger";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  refreshAuth: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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

  const signOut = useCallback(async () => {
    try {
      authLogger.info("Déconnexion...");
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      authLogger.success("Déconnexion réussie");
    } catch (error) {
      authLogger.error("Erreur lors de la déconnexion:", error);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        authLogger.info("Initialisation de l'authentification...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          authLogger.error("Erreur lors de la récupération de la session initiale:", error);
          setLoading(false);
          return;
        }
        
        if (data.session) {
          authLogger.success("Session initiale récupérée");
          setSession(data.session);
          setUser(data.session.user);
        } else {
          authLogger.info("Aucune session active");
        }
      } catch (error) {
        authLogger.error("Exception lors de l'initialisation de l'authentification:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      authLogger.info("Changement d'état d'authentification:", { event, hasSession: !!currentSession });
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        authLogger.trace("Mise à jour de l'état d'authentification", {
          event,
          userId: currentSession?.user?.id,
          sessionExpires: currentSession?.expires_at
        });
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        authLogger.debug("Session terminée");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, refreshAuth, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
