import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://ipuvsaxyhzezuuhhmwcu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwdXZzYXh5aHplenV1aGhtd2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNTE2MTIsImV4cCI6MjA0ODcyNzYxMn0.9bJK5g0wnVScPRWA6sR0vYHvtgVkqnI6c0pekarS3V4";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});