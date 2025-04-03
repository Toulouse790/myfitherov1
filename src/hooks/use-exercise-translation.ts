
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { translateMuscleGroup, reverseTranslateMuscleGroup } from "@/utils/muscleGroupTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export const useExerciseTranslation = () => {
  const { t, language } = useLanguage();

  // Cette fonction traduit le nom du groupe musculaire en utilisant le contexte de langue actuel
  const translateMuscleGroupWithContext = (muscleGroup: string): string => {
    if (!muscleGroup) return '';
    
    // Utiliser l'API de traduction pour obtenir la traduction dans la langue actuelle
    const key = reverseTranslateMuscleGroup(muscleGroup);
    return t(`muscleGroups.${key}`, { fallback: muscleGroup });
  };

  const translateExercise = (exercise: any): Exercise => {
    if (!exercise) return exercise;
    
    const translatedExercise = {
      ...exercise,
      muscle_group: translateMuscleGroupWithContext(exercise.muscle_group),
      muscleGroup: translateMuscleGroupWithContext(exercise.muscleGroup || exercise.muscle_group)
    };
    
    return translatedExercise;
  };

  const translateExercises = (exercises: any[]): Exercise[] => {
    if (!exercises || !Array.isArray(exercises)) return [];
    return exercises.map(translateExercise);
  };

  const translateMuscleGroups = (muscleGroups: string[]): string[] => {
    if (!muscleGroups || !Array.isArray(muscleGroups)) return [];
    return muscleGroups.map(translateMuscleGroupWithContext);
  };

  return {
    translateExercise,
    translateExercises,
    translateMuscleGroups,
    translateMuscleGroupWithContext
  };
};
