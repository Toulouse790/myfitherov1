
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { debugLogger } from "@/utils/debug-logger";

export const useUnifiedWorkoutSession = (sessionId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<string[]>([]);
  
  useEffect(() => {
    if (!sessionId || !user) return;

    const fetchSessionData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setSession(data);
          if (data.exercises) {
            setExercises(data.exercises);
          }
        }
      } catch (error) {
        debugLogger.error("useUnifiedWorkoutSession", "Erreur lors du chargement de la session:", error);
        toast({
          title: t("common.error"),
          description: t("workouts.errors.sessionCreationFailed"),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, user, toast, t]);

  const completeWorkout = async () => {
    if (!sessionId || !user) return;

    try {
      const { error } = await supabase
        .from('workout_sessions')
        .update({
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: t("workouts.sessionCompleted"),
        description: t("workouts.sessionCompletedDetails"),
      });

      return true;
    } catch (error) {
      debugLogger.error("useUnifiedWorkoutSession", "Erreur lors de la finalisation:", error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.sessionFinalizeDescription"),
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    session,
    exercises,
    isLoading,
    completeWorkout,
  };
};
