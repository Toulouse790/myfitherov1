
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { WorkoutSession } from "@/types/workout-session";
import { useLanguage } from "@/contexts/LanguageContext";

export const useActiveSession = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);

  // Check for an active session on hook initialization
  useEffect(() => {
    if (user) {
      checkActiveSession();
    }
  }, [user]);

  const checkActiveSession = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setActiveSession(data);
      }
    } catch (error) {
      console.error(t("workouts.errors.activeSessionCheck"), error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    activeSession,
    setActiveSession,
    checkActiveSession
  };
};
