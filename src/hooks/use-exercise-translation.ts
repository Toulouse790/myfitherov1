
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";
import { useLanguage } from "@/contexts/LanguageContext";

export const useExerciseTranslation = () => {
  const { t } = useLanguage();

  const translateExercise = (exercise: any): Exercise => {
    if (!exercise) return exercise;
    
    const translatedExercise = {
      ...exercise,
      muscle_group: translateMuscleGroup(exercise.muscle_group),
      muscleGroup: translateMuscleGroup(exercise.muscleGroup || exercise.muscle_group)
    };
    
    return translatedExercise;
  };

  const translateExercises = (exercises: any[]): Exercise[] => {
    if (!exercises || !Array.isArray(exercises)) return [];
    return exercises.map(translateExercise);
  };

  const translateMuscleGroups = (muscleGroups: string[]): string[] => {
    if (!muscleGroups || !Array.isArray(muscleGroups)) return [];
    return muscleGroups.map(group => 
      t(`muscleGroups.${group}`, { fallback: translateMuscleGroup(group) })
    );
  };

  return {
    translateExercise,
    translateExercises,
    translateMuscleGroups
  };
};
