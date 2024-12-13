import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { reverseTranslateMuscleGroup } from "@/utils/muscleGroupTranslations";

export const useExerciseSelection = (muscleGroup?: string) => {
  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises', muscleGroup],
    queryFn: async () => {
      console.log('=== Exercise Selection Debug ===');
      console.log('Input muscle group:', muscleGroup);
      
      // 1. Construction de la requête de base
      console.log('Building base query with published exercises filter');
      let query = supabase
        .from('unified_exercises')
        .select('*')
        .eq('is_published', true); // Premier contrôle sur is_published

      // 2. Ajout du filtre par groupe musculaire si spécifié
      if (muscleGroup) {
        const englishGroup = reverseTranslateMuscleGroup(muscleGroup);
        console.log('Translated muscle group:', englishGroup);
        
        // Utiliser une recherche plus flexible avec ilike
        const searchPattern = `%${englishGroup.toLowerCase()}%`;
        console.log('Search pattern for muscle group:', searchPattern);
        
        query = query.ilike('muscle_group', searchPattern);
      }

      // 3. Exécution de la requête
      console.log('Executing Supabase query...');
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      // 4. Logs des données brutes
      console.log('Raw database response:', {
        total: data?.length || 0,
        exercises: data
      });

      // 5. Double vérification des exercices publiés
      const publishedExercises = data?.filter(ex => {
        const isPublished = ex.is_published;
        console.log(`Exercise ${ex.name}: published = ${isPublished}`);
        return isPublished;
      }) || [];
      
      console.log('Published exercises summary:', {
        total: publishedExercises.length,
        muscleGroups: [...new Set(publishedExercises.map(ex => ex.muscle_group))]
      });

      // 6. Mapping vers le format Exercise
      return publishedExercises.map(dbExercise => {
        const exercise: Exercise = {
          id: dbExercise.id,
          name: dbExercise.name,
          muscle_group: dbExercise.muscle_group,
          muscleGroup: dbExercise.muscle_group,
          difficulty: dbExercise.difficulty || ['beginner'],
          equipment: "",
          location: dbExercise.location || [],
          instructions: [],
          targetMuscles: [],
          objectives: [],
          description: "",
          sets: { beginner: 0, intermediate: 0, advanced: 0 },
          reps: { beginner: 0, intermediate: 0, advanced: 0 },
          restTime: { beginner: 0, intermediate: 0, advanced: 0 },
          calories: 0,
          is_published: dbExercise.is_published
        };
        return exercise;
      });
    }
  });

  return { exercises, isLoading };
};