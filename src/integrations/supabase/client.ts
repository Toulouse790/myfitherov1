import { createClient } from '@supabase/supabase-js';

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

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', { event, hasSession: !!session });
  
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    // Clear any auth data from localStorage
    localStorage.removeItem('myfithero-auth');
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    // Optionally store the session
    if (session) {
      localStorage.setItem('myfithero-auth', JSON.stringify(session));
    }
  }
});