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
      console.log('Building base query without published filter');
      let query = supabase
        .from('unified_exercises')
        .select('*');

      // 2. Ajout du filtre par groupe musculaire si spécifié
      if (muscleGroup) {
        const englishGroup = reverseTranslateMuscleGroup(muscleGroup);
        console.log('Translated muscle group:', englishGroup);
        
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

      // 5. Temporairement retourner tous les exercices sans filtrage is_published
      const allExercises = data || [];
      
      // Ajout de logs détaillés pour chaque exercice avec validation des données
      allExercises.forEach(ex => {
        const validationIssues = [];
        
        // Vérification des champs requis
        if (!ex.name) validationIssues.push('missing name');
        if (!ex.muscle_group) validationIssues.push('missing muscle_group');
        if (!ex.difficulty || !Array.isArray(ex.difficulty)) validationIssues.push('invalid difficulty');
        if (!ex.location || !Array.isArray(ex.location)) validationIssues.push('invalid location');
        
        console.log(`Exercise validation:`, {
          id: ex.id,
          name: ex.name,
          muscleGroup: ex.muscle_group,
          isPublished: ex.is_published,
          difficulty: ex.difficulty,
          location: ex.location,
          validationIssues: validationIssues.length > 0 ? validationIssues : 'no issues'
        });
      });

      console.log('All exercises summary:', {
        total: allExercises.length,
        muscleGroups: [...new Set(allExercises.map(ex => ex.muscle_group))]
      });

      // 6. Mapping vers le format Exercise
      return allExercises.map(dbExercise => {
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