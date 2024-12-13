import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { reverseTranslateMuscleGroup } from "@/utils/muscleGroupTranslations";
import { useAuth } from "@/hooks/use-auth";

export const useExerciseSelection = (muscleGroup?: string) => {
  const { user } = useAuth();

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises', muscleGroup],
    queryFn: async () => {
      console.log('=== Exercise Selection Debug ===');
      console.log('Input muscle group:', muscleGroup);
      console.log('Current user:', user ? {
        id: user.id,
        metadata: user.user_metadata
      } : 'No user logged in');
      
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

      // 5. Validation détaillée des exercices
      const allExercises = data || [];
      
      allExercises.forEach(ex => {
        const validationIssues = [];
        
        // Validation des champs requis
        if (!ex.name) validationIssues.push('missing name');
        if (!ex.muscle_group) validationIssues.push('missing muscle_group');
        
        // Validation des tableaux
        if (!ex.difficulty) {
          validationIssues.push('missing difficulty');
        } else if (!Array.isArray(ex.difficulty)) {
          validationIssues.push('difficulty is not an array');
        } else if (ex.difficulty.length === 0) {
          validationIssues.push('empty difficulty array');
        }

        if (!ex.location) {
          validationIssues.push('missing location');
        } else if (!Array.isArray(ex.location)) {
          validationIssues.push('location is not an array');
        }

        // Validation des types de données
        if (typeof ex.name !== 'string') validationIssues.push('invalid name type');
        if (typeof ex.muscle_group !== 'string') validationIssues.push('invalid muscle_group type');
        
        // Validation des URLs (optionnels)
        if (ex.image_url && typeof ex.image_url !== 'string') validationIssues.push('invalid image_url type');
        if (ex.video_url && typeof ex.video_url !== 'string') validationIssues.push('invalid video_url type');

        // Vérification de la correspondance avec le niveau utilisateur
        const userLevel = user?.user_metadata?.level || 'beginner';
        const exerciseLevel = ex.difficulty?.[0] || 'beginner';
        const levelMatch = ex.difficulty?.includes(userLevel);

        console.log(`Exercise validation [${ex.id}]:`, {
          name: ex.name,
          muscleGroup: ex.muscle_group,
          difficulty: ex.difficulty,
          location: ex.location,
          userLevel,
          exerciseLevel,
          levelMatch,
          image: ex.image_url ? 'present' : 'missing',
          video: ex.video_url ? 'present' : 'missing',
          validationIssues: validationIssues.length > 0 ? validationIssues : 'no issues',
          rawData: ex // Log des données brutes pour inspection
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