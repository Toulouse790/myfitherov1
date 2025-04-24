
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
        
        // Établissement de l'écouteur AVANT de vérifier la session existante
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
          debugLogger.log("Auth", `Changement d'état d'authentification: ${event}`, { hasSession: !!newSession });
          
          // Mettre à jour synchroniquement les états
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Actions supplémentaires à effectuer après délai pour éviter deadlock
          if (event === 'SIGNED_IN' && newSession) {
            setTimeout(() => {
              toast({
                title: "Connexion réussie",
                description: `Bienvenue ${newSession.user.email?.split('@')[0] || ''}!`,
              });
            }, 0);
          } else if (event === 'SIGNED_OUT') {
            setTimeout(() => {
              toast({
                title: "Déconnexion réussie",
                description: "À bientôt !",
              });
            }, 0);
          }
        });
        
        // Vérifier ensuite s'il existe une session active
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          debugLogger.log("Auth", "Session existante trouvée");
          setSession(existingSession);
          setUser(existingSession.user);
        } else {
          debugLogger.log("Auth", "Aucune session existante");
        }
        
        setLoading(false);
        
        // Nettoyer l'abonnement à la désinscription
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        debugLogger.error("Auth", "Erreur lors de l'initialisation de l'authentification:", error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [toast]);

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
