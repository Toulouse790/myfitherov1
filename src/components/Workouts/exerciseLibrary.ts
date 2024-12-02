import { Exercise } from './types/exercise';
import { chestExercises } from './exercises/chestExercises';

export const exercises: Exercise[] = [
  ...chestExercises
];

export type { Exercise };