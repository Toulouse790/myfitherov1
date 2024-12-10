import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";

export const useExerciseTranslation = () => {
  const translateExercise = (exercise: any): Exercise => {
    if (exercise.muscle_group === 'abs') {
      return {
        ...exercise,
        muscle_group: 'abdominaux'
      };
    }
    return exercise;
  };

  const translateExercises = (exercises: any[]): Exercise[] => {
    return exercises.map(translateExercise);
  };

  return {
    translateExercise,
    translateExercises
  };
};