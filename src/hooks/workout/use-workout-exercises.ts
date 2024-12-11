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
          // S'assurer que les noms d'exercices sont correctement décodés
          const sanitizedExercises = session.exercises.map(exercise => 
            decodeURIComponent(exercise)
          );
          console.log('Fetched exercises:', sanitizedExercises);
          setExercises(sanitizedExercises);
        }

      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch exercises'));
        toast({
          title: "Erreur",
          description: "Impossible de charger les exercices",
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