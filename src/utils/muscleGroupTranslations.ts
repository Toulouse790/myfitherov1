export const translateMuscleGroup = (englishGroup: string): string => {
  const translations: { [key: string]: string } = {
    'chest': 'Pectoraux',
    'back': 'Dos',
    'legs': 'Jambes',
    'shoulders': 'Épaules',
    'biceps': 'Biceps',
    'triceps': 'Triceps',
    'abs': 'Abdominaux',
  };
  
  return translations[englishGroup.toLowerCase()] || englishGroup;
};

export const reverseTranslateMuscleGroup = (frenchGroup: string): string => {
  const reverseTranslations: { [key: string]: string } = {
    'Pectoraux': 'chest',
    'Dos': 'back',
    'Jambes': 'legs',
    'Épaules': 'shoulders',
    'Biceps': 'biceps',
    'Triceps': 'triceps',
    'Abdominaux': 'abs',
  };
  
  return reverseTranslations[frenchGroup] || frenchGroup;
};