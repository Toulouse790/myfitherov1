
import { createClient } from '@supabase/supabase-js';
import { debugLogger } from '@/utils/debug-logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

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
      flowType: 'pkce'
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
      }
    }
  }
);

// Amélioration du logging pour faciliter le débogage des problèmes d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  debugLogger.log('Auth', `Auth state changed: ${event}`, { event, hasSession: !!session });
  
  if (event === 'SIGNED_OUT') {
    debugLogger.log('Auth', 'User signed out, clearing auth data');
    localStorage.removeItem('myfithero-auth');
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    debugLogger.log('Auth', 'User signed in or token refreshed');
    if (session) {
      localStorage.setItem('myfithero-auth', JSON.stringify(session));
    }
  } else if (event === 'USER_UPDATED') {
    debugLogger.log('Auth', 'User profile updated');
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

