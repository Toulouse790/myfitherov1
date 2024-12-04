import { Exercise } from './exercises/types/exercise';
import { chestExercises } from './exercises/chestExercises';
import { backExercises } from './exercises/backExercises';
import { legsExercises } from './exercises/legsExercises';
import { shouldersExercises } from './exercises/shouldersExercises';
import { armsExercises } from './exercises/armsExercises';
import { absExercises } from './exercises/absExercises';
import { cardioExercises } from './exercises/cardioExercises';

export const exercises: Exercise[] = [
  ...chestExercises,
  ...backExercises,
  ...legsExercises,
  ...shouldersExercises,
  ...armsExercises,
  ...absExercises,
  ...cardioExercises
];

export const filterExercises = (
  location: ("home" | "gym" | "outdoor")[],
  difficulty: string,
  objectives: ("weight_loss" | "muscle_gain" | "maintenance" | "endurance")[],
  equipment?: string[]
): Exercise[] => {
  return exercises.filter(exercise => {
    const locationMatch = location.some(loc => exercise.location.includes(loc));
    const difficultyMatch = exercise.difficulty === difficulty;
    const objectiveMatch = objectives.some(obj => exercise.objectives.includes(obj));
    const equipmentMatch = !equipment || equipment.includes(exercise.equipment);
    
    return locationMatch && difficultyMatch && objectiveMatch && equipmentMatch;
  });
};

export type { Exercise };