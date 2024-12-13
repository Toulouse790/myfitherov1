import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { reverseTranslateMuscleGroup } from "@/utils/muscleGroupTranslations";

export const useExerciseSelection = (muscleGroup?: string) => {
  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises', muscleGroup],
    queryFn: async () => {
      console.log('Fetching exercises for muscle group:', muscleGroup);
      const englishGroup = muscleGroup ? reverseTranslateMuscleGroup(muscleGroup) : undefined;
      console.log('English muscle group:', englishGroup);

      let query = supabase
        .from('unified_exercises')
        .select('*')
        .eq('is_published', true)
        .order('name', { ascending: true });

      if (englishGroup) {
        query = query.eq('muscle_group', englishGroup.toLowerCase());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      console.log('Raw exercises data:', data);

      return data?.map(dbExercise => {
        const exercise: Exercise = {
          id: dbExercise.id,
          name: dbExercise.name,
          muscleGroup: muscleGroup || '',
          difficulty: Array.isArray(dbExercise.difficulty) ? dbExercise.difficulty[0] : "beginner",
          equipment: "",
          location: dbExercise.location || [],
          instructions: [],
          targetMuscles: [],
          objectives: [],
          description: "",
          sets: { beginner: 0, intermediate: 0, advanced: 0 },
          reps: { beginner: 0, intermediate: 0, advanced: 0 },
          restTime: { beginner: 0, intermediate: 0, advanced: 0 },
          calories: 0
        };
        return exercise;
      }) || [];
    }
  });

  return { exercises, isLoading };
};