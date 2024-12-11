import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { normalizeExerciseName, isValidExerciseName } from "@/utils/exerciseUtils";

export const useWorkoutExercises = (sessionId: string | null) => {
  const [exercises, setExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      if (!sessionId) {
        console.log('No session ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching exercises for session:', sessionId);
        
        const { data: session, error: sessionError } = await supabase
          .from('workout_sessions')
          .select('exercises')
          .eq('id', sessionId)
          .single();

        if (sessionError) {
          console.error('Session fetch error:', sessionError);
          throw sessionError;
        }

        if (session?.exercises) {
          // Nettoyage et normalisation des noms d'exercices
          const sanitizedExercises = session.exercises
            .filter(isValidExerciseName)
            .map(exercise => {
              const normalizedName = normalizeExerciseName(exercise);
              console.log(`Normalized exercise name: ${exercise} -> ${normalizedName}`);
              return exercise.trim();
            });
            
          console.log('Fetched and sanitized exercises:', sanitizedExercises);
          setExercises(sanitizedExercises);
        }

      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch exercises'));
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les exercices. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [sessionId, toast]);

  return { exercises, isLoading, error };
};