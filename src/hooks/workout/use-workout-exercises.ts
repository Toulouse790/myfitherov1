import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useWorkoutExercises = (sessionId: string | null) => {
  const [exercises, setExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSessionExercises = async () => {
      try {
        console.log("Fetching exercises for session:", sessionId);
        
        const { data: session, error: sessionError } = await supabase
          .from('workout_sessions')
          .select('exercises')
          .eq('id', sessionId)
          .single();

        if (sessionError) throw sessionError;
        
        if (!session?.exercises) {
          console.log("No exercises found in session");
          setExercises([]);
          return;
        }

        console.log("Exercices récupérés:", session.exercises);
        setExercises(session.exercises);

      } catch (err) {
        console.error("Error fetching session exercises:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionExercises();
  }, [sessionId]);

  return { exercises, isLoading, error };
};