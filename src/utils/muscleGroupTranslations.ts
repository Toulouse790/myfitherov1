
/**
 * Ce fichier contient des fonctions utilitaires pour traduire les noms de groupes musculaires.
 * Attention: la fonction translateMuscleGroupWithContext a été déplacée vers useExerciseTranslation
 * pour une meilleure gestion du contexte React.
 */

export const translateMuscleGroup = (muscleGroup: string): string => {
  if (!muscleGroup) return '';
  
  // Map de traduction des noms affichés vers les identifiants utilisés en BDD
  const translationMap: { [key: string]: string } = {
    'chest': 'pectoraux',
    'back': 'dos',
    'legs': 'jambes',
    'shoulders': 'épaules',
    'biceps': 'biceps',
    'triceps': 'triceps', 
    'abs': 'abdominaux',
    'core': 'gainage',
    'full_body': 'corps complet',
    'upper_body': 'haut du corps',
    'lower_body': 'bas du corps',
    'quads': 'quadriceps',
    'hamstrings': 'ischio-jambiers',
    'glutes': 'fessiers',
    'calves': 'mollets',
    'cardio': 'cardio'
  };

  return translationMap[muscleGroup.toLowerCase()] || muscleGroup.toLowerCase();
};

export const reverseTranslateMuscleGroup = (muscleGroup: string): string => {
  const translations: { [key: string]: string } = {
    'pectoraux': 'chest',
    'dos': 'back',
    'jambes': 'legs',
    'épaules': 'shoulders',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'abdominaux': 'abs',
    'gainage': 'core',
    'corps complet': 'full_body',
    'haut du corps': 'upper_body',
    'bas du corps': 'lower_body',
    'quadriceps': 'quads',
    'ischio-jambiers': 'hamstrings',
    'fessiers': 'glutes',
    'mollets': 'calves',
    'cardio': 'cardio'
  };

  const key = muscleGroup.toLowerCase();
  return translations[key] || muscleGroup;
};
