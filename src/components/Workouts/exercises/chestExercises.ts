import { Exercise } from './types/exercise';
import { basicChestExercises } from './data/chest/basicChestExercises';
import { advancedChestExercises } from './data/chest/advancedChestExercises';
import { bodyweightChestExercises } from './data/chest/bodyweightChestExercises';

export const chestExercises: Exercise[] = [
  ...basicChestExercises,
  ...advancedChestExercises,
  ...bodyweightChestExercises
];