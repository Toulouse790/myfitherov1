import { Exercise } from './exercises/types/exercise';
import { validateExercise } from './exercises/types/exercise';
import { basicChestExercises } from './exercises/data/chest/basicChestExercises';
import { advancedChestExercises } from './exercises/data/chest/advancedChestExercises';
import { bodyweightChestExercises } from './exercises/data/chest/bodyweightChestExercises';
import { backExercises } from './exercises/backExercises';
import { legsExercises } from './exercises/legsExercises';
import { shouldersExercises } from './exercises/shouldersExercises';
import { armsExercises } from './exercises/armsExercises';
import { absExercises } from './exercises/data/abs';
import { cardioExercises } from './exercises/cardioExercises';

const removeDuplicates = (exercises: Exercise[]): Exercise[] => {
  const seen = new Set<string>();
  return exercises.filter((exercise) => {
    if (!exercise || !validateExercise(exercise)) {
      console.warn(`Invalid exercise found: ${exercise?.name || 'unknown'}`);
      return false;
    }
    const duplicate = seen.has(exercise.id);
    seen.add(exercise.id);
    return !duplicate;
  });
};

export const exercises: Exercise[] = removeDuplicates([
  ...basicChestExercises,
  ...advancedChestExercises,
  ...bodyweightChestExercises,
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
  objectives: ("muscle_gain" | "maintenance" | "weight_loss" | "endurance")[],
  equipment?: string[]
): Exercise[] => {
  return exercises.filter(ex => {
    if (!validateExercise(ex)) return false;
    
    const locationMatch = location.some(loc => ex.location.includes(loc));
    const difficultyMatch = ex.difficulty.some(diff => difficulty.includes(diff));
    const objectiveMatch = ex.objectives?.some(obj => objectives.includes(obj));
    const equipmentMatch = !equipment || equipment.includes(ex.equipment);
    
    return locationMatch && difficultyMatch && objectiveMatch && equipmentMatch;
  });
};

export type { Exercise };