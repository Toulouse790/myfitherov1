import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

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
      }
    },
    db: {
      schema: 'public'
    }
  }
);

// Test the connection and log session status
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', { event, hasSession: !!session });
});

// Test the connection
const testConnection = async () => {
  try {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    console.log('Supabase connection successful');
  } catch (error) {
    console.error('Supabase connection error:', error);
  }
};

testConnection();