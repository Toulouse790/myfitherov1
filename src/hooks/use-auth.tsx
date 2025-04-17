
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { debugLogger } from '@/utils/debug-logger';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        debugLogger.error("Auth", "Erreur lors de l'initialisation de l'authentification:", error);
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
      
      setLoading(false);
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
      return { data, error: null };
    } catch (error) {
      debugLogger.error("Auth", "Erreur de connexion:", error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      debugLogger.log("Auth", "Tentative de déconnexion");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      debugLogger.error("Auth", "Erreur de déconnexion:", error);
      return { error };
    }
  };

  return { 
    user,
    session,
    loading,
    signIn,
    signOut
  };
};
