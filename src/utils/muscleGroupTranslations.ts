export const translateMuscleGroup = (muscleGroup: string): string => {
  const translations: { [key: string]: string } = {
    'chest': 'pectoraux',
    'back': 'dos',
    'legs': 'jambes',
    'shoulders': 'épaules',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'abs': 'abdominaux',
    'pectoraux': 'pectoraux',
    'dos': 'dos',
    'jambes': 'jambes',
    'épaules': 'épaules',
    'abdominaux': 'abdominaux'
  };

  return translations[muscleGroup.toLowerCase()] || muscleGroup;
};

export const reverseTranslateMuscleGroup = (muscleGroup: string): string => {
  const translations: { [key: string]: string } = {
    'pectoraux': 'pectoraux',
    'dos': 'dos',
    'jambes': 'jambes',
    'épaules': 'épaules',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'abdominaux': 'abdominaux'
  };

  return translations[muscleGroup.toLowerCase()] || muscleGroup;
};