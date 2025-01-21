import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
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
      storageKey: 'myfithero-auth'
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey
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
    console.log('Testing Supabase connection...');
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('Current user:', user);
    } else {
      console.log('No authenticated user found');
    }
  } catch (error) {
    console.error('Error in test connection:', error);
  }
};

testConnection();