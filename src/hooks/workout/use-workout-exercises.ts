import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useWorkoutExercises = (sessionId: string | null) => {
  const [exercises, setExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: session, error: sessionError } = await supabase
          .from('workout_sessions')
          .select('exercises')
          .eq('id', sessionId)
          .single();

        if (sessionError) throw sessionError;

        if (session?.exercises) {
          setExercises(session.exercises);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch exercises'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [sessionId]);

  return { exercises, isLoading, error };
};