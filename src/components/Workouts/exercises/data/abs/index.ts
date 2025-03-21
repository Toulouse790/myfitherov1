
import { Exercise } from '../../types/exercise';
import { basicAbsExercises } from './basicAbsExercises';
import { advancedAbsExercises } from './advancedAbsExercises';
import { dynamicAbsExercises } from './dynamicAbsExercises';

export const absExercises: Exercise[] = [
  ...basicAbsExercises,
  ...advancedAbsExercises,
  ...dynamicAbsExercises
];
