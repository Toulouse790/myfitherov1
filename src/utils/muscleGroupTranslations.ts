
export const translateMuscleGroup = (muscleGroup: string): string => {
  // Map de traduction des noms affichés vers les identifiants utilisés en BDD
  const translationMap: { [key: string]: string } = {
    'chest': 'pectoraux',
    'back': 'dos',
    'legs': 'jambes',
    'shoulders': 'épaules',
    'biceps': 'biceps',
    'triceps': 'triceps', 
    'abs': 'abdominaux'
  };

  if (!muscleGroup) return '';
  
  return translationMap[muscleGroup.toLowerCase()] || muscleGroup.toLowerCase();
};

export const reverseTranslateMuscleGroup = (muscleGroup: string): string => {
  const translations: { [key: string]: string } = {
    'pectoraux': 'Pectoraux',
    'dos': 'Dos',
    'jambes': 'Jambes',
    'épaules': 'Épaules',
    'biceps': 'Biceps',
    'triceps': 'Triceps',
    'abdominaux': 'Abdominaux'
  };

  const key = muscleGroup.toLowerCase();
  return translations[key] || muscleGroup;
};
