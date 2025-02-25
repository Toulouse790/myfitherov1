
import { supabase } from './client';
import type { User } from '@supabase/supabase-js';

// Gérer le rafraîchissement de session de manière plus robuste
let refreshPromise: Promise<any> | null = null;

export const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = supabase.auth.refreshSession()
      .then((response) => {
        refreshPromise = null;
        return response;
      })
      .catch((error) => {
        refreshPromise = null;
        console.error("Erreur lors du rafraîchissement de la session:", error);
        throw error;
      });
  }
  return refreshPromise;
};

export const getUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Essayer de rafraîchir la session si aucun utilisateur n'est trouvé
      const { data } = await refreshSession();
      return data.user;
    }
    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};

// Fonction utilitaire pour vérifier si un utilisateur est authentifié
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getUser();
  return !!user;
};

// Fonction pour se déconnecter proprement
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Nettoyer le stockage local
    localStorage.removeItem('myfithero-auth');
    sessionStorage.clear(); // Nettoyer aussi le sessionStorage
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
};

// Fonction pour obtenir le token d'accès actuel
export const getAccessToken = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
    return null;
  }
};
