
import { Exercise } from '../../types/exercise';
import { basicChestExercises } from './basicChestExercises';
import { advancedChestExercises } from './advancedChestExercises';
import { bodyweightChestExercises } from './bodyweightChestExercises';

export const chestExercises: Exercise[] = [
  ...basicChestExercises,
  ...advancedChestExercises,
  ...bodyweightChestExercises
];
