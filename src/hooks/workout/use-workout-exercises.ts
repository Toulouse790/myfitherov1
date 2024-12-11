import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWorkoutExercises = (sessionId: string | null) => {
  const [exercises, setExercises] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchExercises = async () => {
      if (!sessionId) {
        setExercises([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching exercises for session:', sessionId);

        const { data: session, error: sessionError } = await supabase
          .from('workout_sessions')
          .select('exercises')
          .eq('id', sessionId)
          .single();

        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          throw sessionError;
        }

        if (session?.exercises) {
          // Nettoyage et validation des noms d'exercices
          const sanitizedExercises = session.exercises
            .filter(Boolean)
            .map(exercise => {
              // S'assurer que c'est une chaîne de caractères
              if (typeof exercise !== 'string') {
                console.warn('Invalid exercise format:', exercise);
                return '';
              }
              return exercise.trim();
            })
            .filter(exercise => exercise.length > 0); // Enlever les chaînes vides
            
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