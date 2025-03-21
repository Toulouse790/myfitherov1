
import { Exercise } from '../../types/exercise';
import { basicChestExercises } from './basicChestExercises';
import { advancedChestExercises } from './advancedChestExercises';
import { bodyweightChestExercises } from './bodyweightChestExercises';

// Utiliser un Map pour garantir l'unicité par ID
const uniqueExercisesMap = new Map<string, Exercise>();

// Ajouter tous les exercices au Map (le dernier avec le même ID remplace les précédents)
[...basicChestExercises, ...advancedChestExercises, ...bodyweightChestExercises].forEach(exercise => {
  uniqueExercisesMap.set(exercise.id, exercise);
});

// Convertir le Map en tableau
export const chestExercises: Exercise[] = Array.from(uniqueExercisesMap.values());
