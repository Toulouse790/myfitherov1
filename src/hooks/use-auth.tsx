
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { debugLogger } from '@/utils/debug-logger';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier l'état de l'authentification initiale
    const initializeAuth = async () => {
      try {
        debugLogger.log("Auth", "Initialisation de l'authentification...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          debugLogger.log("Auth", "Session existante trouvée");
          setSession(session);
          setUser(session.user);
        } else {
          debugLogger.log("Auth", "Aucune session existante");
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        debugLogger.error("Auth", "Erreur lors de l'initialisation de l'authentification:", error);
      } finally {
        setLoading(false);
      }
    };

    // Configurer l'écouteur d'événements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      debugLogger.log("Auth", "Changement d'état d'authentification:", event);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        debugLogger.log("Auth", "Utilisateur déconnecté");
      } else if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        debugLogger.log("Auth", "Utilisateur connecté ou token rafraîchi");
      }
    });

    // Initialiser l'authentification
    initializeAuth();

    // Nettoyer l'abonnement
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fonctions utilitaires pour l'authentification
  const signIn = async (email: string, password: string) => {
    try {
      debugLogger.log("Auth", "Tentative de connexion avec email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      if (data.user) {
        toast({
          title: "Connexion réussie",
          description: `Bienvenue ${data.user.email?.split('@')[0] || ''}!`,
        });
      }
      
      return { data, error: null };
    } catch (error: any) {
      debugLogger.error("Auth", "Erreur de connexion:", error);
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Identifiants incorrects",
      });
      
      return { data: null, error };
    }
  };

  const signOut = useCallback(async () => {
    try {
      debugLogger.log("Auth", "Tentative de déconnexion");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      debugLogger.error("Auth", "Erreur de déconnexion:", error);
      return { error };
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      debugLogger.log("Auth", "Rafraîchissement de la session");
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        debugLogger.error("Auth", "Erreur lors du rafraîchissement de la session:", error);
        return { success: false, error };
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        debugLogger.log("Auth", "Session rafraîchie avec succès");
        return { success: true, error: null };
      } else {
        debugLogger.warn("Auth", "Aucune session disponible après rafraîchissement");
        return { success: false, error: new Error("Aucune session disponible") };
      }
    } catch (error) {
      debugLogger.error("Auth", "Exception lors du rafraîchissement de la session:", error);
      return { success: false, error };
    }
  }, []);

  return { 
    user,
    session,
    loading,
    signIn,
    signOut,
    refreshSession
  };
};
