
import { Exercise } from '../../types/exercise';
import { basicAbsExercises } from './basicAbsExercises';
import { advancedAbsExercises } from './advancedAbsExercises';
import { dynamicAbsExercises } from './dynamicAbsExercises';

// Utiliser un Map pour garantir l'unicité par ID
const uniqueExercisesMap = new Map<string, Exercise>();

// Ajouter tous les exercices au Map (le dernier avec le même ID remplace les précédents)
[...basicAbsExercises, ...advancedAbsExercises, ...dynamicAbsExercises].forEach(exercise => {
  uniqueExercisesMap.set(exercise.id, exercise);
});

// Convertir le Map en tableau
export const absExercises: Exercise[] = Array.from(uniqueExercisesMap.values());
