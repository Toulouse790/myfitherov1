export const translateMuscleGroup = (muscleGroup: string): string => {
  const translations: { [key: string]: string } = {
    'chest': 'pectoraux',
    'back': 'dos',
    'legs': 'jambes',
    'shoulders': 'épaules',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'abs': 'abdominaux',
    'pectoraux': 'chest',
    'dos': 'back',
    'jambes': 'legs',
    'épaules': 'shoulders',
    'abdominaux': 'abs'
  };

  return translations[muscleGroup.toLowerCase()] || muscleGroup;
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
    'chest': 'pectoraux',
    'back': 'dos',
    'legs': 'jambes',
    'shoulders': 'épaules',
    'abs': 'abdominaux'
  };

  return translations[muscleGroup.toLowerCase()] || muscleGroup;
};