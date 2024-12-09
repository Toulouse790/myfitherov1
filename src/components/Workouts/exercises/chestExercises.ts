import { Exercise } from './types/exercise';
import { basicChestExercises } from './data/basicChestExercises';
import { advancedChestExercises } from './data/advancedChestExercises';
import { bodyweightChestExercises } from './data/bodyweightChestExercises';

export const chestExercises: Exercise[] = [
  ...basicChestExercises,
  ...advancedChestExercises,
  ...bodyweightChestExercises
];