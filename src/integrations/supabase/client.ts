
import { createClient } from '@supabase/supabase-js';
import { debugLogger } from '@/utils/debug-logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes');
  throw new Error('Variables d\'environnement Supabase manquantes');
}

debugLogger.log("Supabase", "Initialisation du client Supabase avec URL:", supabaseUrl);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
      storageKey: 'myfithero-auth',
      flowType: 'pkce' // Utiliser PKCE pour une sécurité accrue
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
      }
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Amélioration du logging pour faciliter le débogage des problèmes d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  debugLogger.log('Auth', `Changement d'état d'authentification: ${event}`, { event, hasSession: !!session });
  
  if (event === 'SIGNED_OUT') {
    debugLogger.log('Auth', 'Utilisateur déconnecté, nettoyage des données d\'authentification');
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    debugLogger.log('Auth', 'Utilisateur connecté ou token rafraîchi');
  } else if (event === 'USER_UPDATED') {
    debugLogger.log('Auth', 'Profil utilisateur mis à jour');
  }
});

// Fonction d'aide pour vérifier rapidement l'état d'authentification
export const getAuthStatus = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      isAuthenticated: !!session,
      user: session?.user || null,
      error: null
    };
  } catch (error) {
    debugLogger.error("Auth", "Erreur lors de la vérification de l'authentification", error);
    return {
      isAuthenticated: false,
      user: null,
      error
    };
  }
};

// Fonction pour tester la connexion à Supabase
export const testSupabaseConnection = async () => {
  try {
    debugLogger.log('Connexion', 'Test de connexion à Supabase...');
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      debugLogger.error('Connexion', 'Erreur de connexion à Supabase', error);
      return { success: false, error };
    }
    
    debugLogger.log('Connexion', 'Connexion à Supabase réussie');
    return { success: true };
  } catch (error) {
    debugLogger.error('Connexion', 'Exception lors de la connexion à Supabase', error);
    return { success: false, error };
  }
};
