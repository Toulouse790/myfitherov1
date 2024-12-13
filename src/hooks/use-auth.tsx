import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

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
        console.log("Initial auth state:", { hasSession: !!session });
      } catch (error) {
        console.error("Error getting initial session:", error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", { event, hasSession: !!session });
      
      if (event === 'SIGNED_OUT') {
        // Only update user state if it's an explicit sign out
        setUser(null);
      } else if (session?.user) {
        setUser(session.user);
      }
      
      setLoading(false);
    });

    // Attempt to recover session from storage on mount
    const savedSession = localStorage.getItem('myfithero-auth');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session?.user) {
          setUser(session.user);
        }
      } catch (error) {
        console.error("Error recovering session:", error);
      }
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};