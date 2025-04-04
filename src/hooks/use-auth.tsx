
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { debugLogger } from '@/utils/debug-logger';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
        debugLogger.log("Auth", "Initial auth state: " + (!!session ? "connecté" : "non connecté"));
      } catch (error) {
        debugLogger.error("Auth", "Error getting initial session:", error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      debugLogger.log("Auth", "Auth state changed: " + event);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        debugLogger.log("Auth", "User signed out");
      } else if (session?.user) {
        setUser(session.user);
        debugLogger.log("Auth", "User signed in or token refreshed");
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
