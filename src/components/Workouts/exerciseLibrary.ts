import { Exercise } from './exercises/types/exercise';
import { validateExercise } from './exercises/types/exercise';
import { chestExercises } from './exercises/chestExercises';
import { backExercises } from './exercises/backExercises';
import { legsExercises } from './exercises/legsExercises';
import { shouldersExercises } from './exercises/shouldersExercises';
import { armsExercises } from './exercises/armsExercises';
import { absExercises } from './exercises/absExercises';
import { cardioExercises } from './exercises/cardioExercises';

// Fonction pour dédupliquer les exercices basée sur leur ID
const removeDuplicates = (exercises: Exercise[]): Exercise[] => {
  const seen = new Set();
  return exercises.filter(exercise => {
    if (!validateExercise(exercise)) {
      console.warn(`Invalid exercise found: ${exercise?.name || 'unknown'}`);
      return false;
    }
    const duplicate = seen.has(exercise.id);
    seen.add(exercise.id);
    return !duplicate;
  });
};

// Combine tous les exercices et retire les doublons
export const exercises: Exercise[] = removeDuplicates([
  ...chestExercises,
  ...backExercises,
  ...legsExercises,
  ...shouldersExercises,
  ...armsExercises,
  ...absExercises,
  ...cardioExercises
]);

export const filterExercises = (
  location: ("home" | "gym" | "outdoor")[],
  difficulty: string[],
  objectives: ("weight_loss" | "muscle_gain" | "maintenance" | "endurance")[],
  equipment?: string[]
): Exercise[] => {
  return exercises.filter(exercise => {
    if (!validateExercise(exercise)) return false;
    
    const locationMatch = location.some(loc => exercise.location.includes(loc));
    const difficultyMatch = exercise.difficulty.some(diff => difficulty.includes(diff));
    const objectiveMatch = exercise.objectives?.some(obj => objectives.includes(obj));
    const equipmentMatch = !equipment || equipment.includes(exercise.equipment);
    
    return locationMatch && difficultyMatch && objectiveMatch && equipmentMatch;
  });
};

export type { Exercise };