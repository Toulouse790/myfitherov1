import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useWorkoutExercises } from "./use-workout-exercises";

export const useWorkoutSession = (sessionId?: string) => {
  const { user } = useAuth();
  const { data: exercises } = useWorkoutExercises(sessionId);

  const { data: session, isLoading } = useQuery({
    queryKey: ["workout-session", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      
      const { data, error } = await supabase
        .from("workout_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!sessionId && !!user,
  });

  return {
    session,
    exercises,
    isLoading,
  };
};