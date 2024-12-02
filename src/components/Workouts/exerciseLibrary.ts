import { Exercise } from './types/exercise';
import { chestExercises } from './exercises/chestExercises';
import { backExercises } from './exercises/backExercises';
import { legsExercises } from './exercises/legsExercises';
import { shouldersExercises } from './exercises/shouldersExercises';
import { armsExercises } from './exercises/armsExercises';
import { absExercises } from './exercises/absExercises';

export type { Exercise };

export const exercises: Exercise[] = [
  ...chestExercises,
  ...backExercises,
  ...legsExercises,
  ...shouldersExercises,
  ...armsExercises,
  ...absExercises,
];