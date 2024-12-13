export const translateMuscleGroup = (englishGroup: string): string => {
  const translations: { [key: string]: string } = {
    'chest': 'pectoraux',
    'back': 'dos',
    'legs': 'jambes',
    'shoulders': 'épaules',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'abs': 'abdominaux',
  };
  
  return translations[englishGroup.toLowerCase()] || englishGroup;
};

export const reverseTranslateMuscleGroup = (frenchGroup: string): string => {
  const reverseTranslations: { [key: string]: string } = {
    'pectoraux': 'chest',
    'dos': 'back',
    'jambes': 'legs',
    'épaules': 'shoulders',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'abdominaux': 'abs',
  };
  
  return reverseTranslations[frenchGroup.toLowerCase()] || frenchGroup;
};