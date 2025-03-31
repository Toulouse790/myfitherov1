
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { WorkoutSession } from "@/types/workout-session";

export const useActiveSession = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);

  const checkActiveSession = async () => {
    if (!user) return null;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) {
        console.error(t("workouts.errors.activeSessionCheck"), error);
        return null;
      }
      
      setActiveSession(data);
      return data;
    } catch (error) {
      console.error(t("workouts.errors.activeSessionCheck"), error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkActiveSession();
    }
  }, [user]);

  return {
    isLoading,
    activeSession,
    setActiveSession,
    checkActiveSession
  };
};
