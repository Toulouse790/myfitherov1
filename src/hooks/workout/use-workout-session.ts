
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWorkoutExercises } from "./use-workout-exercises";
import { useLanguage } from "@/contexts/LanguageContext";

export const useWorkoutSession = (sessionId?: string) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { exercises, isLoading: exercisesLoading } = useWorkoutExercises(sessionId);

  const { data: session, isLoading } = useQuery({
    queryKey: ["workout-session", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      
      const { data, error } = await supabase
        .from("workout_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();

      if (error) {
        console.error(t("workouts.errors.sessionFetch"), error);
        throw error;
      }
      return data;
    },
    enabled: !!sessionId && !!user,
  });

  return {
    session,
    exercises,
    isLoading: isLoading || exercisesLoading,
  };
};
