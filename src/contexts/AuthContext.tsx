
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { authLogger } from "@/utils/auth-logger";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        authLogger.error("Session refresh error:", error);
        return;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        authLogger.success("Session refreshed successfully");
      } else {
        setSession(null);
        setUser(null);
        authLogger.warn("No active session after refresh");
      }
    } catch (error) {
      authLogger.error("Exception during session refresh:", error);
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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Erreur inattendue",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message || "Erreur inattendue",
      });
      return { error };
    }
  };

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      authLogger.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
      });
    }
  }, [toast]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setSession(session);
          setUser(session.user);
          debugLogger.log("Authentication", "Session established", { userId: session.user.id });
        }
      } catch (error) {
        debugLogger.error("Authentication", "Initialization error", error);
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      debugLogger.log("Authentication", "State changed", { event });
      
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
      } else {
        setSession(null);
        setUser(null);
      }
    });

    initializeAuth();

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
      signUp, 
      signOut, 
      refreshSession 
    }}>
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
