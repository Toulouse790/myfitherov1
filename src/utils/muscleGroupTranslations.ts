export const translateMuscleGroup = (group: string): string => {
  const translations: { [key: string]: string } = {
    'chest': 'poitrine',
    'back': 'dos',
    'legs': 'jambes',
    'shoulders': 'épaules',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'abs': 'abdominaux',
    'arms': 'bras',
    'full_body': 'corps complet',
    'glutes': 'fessiers'
  };
  return translations[group.toLowerCase()] || group;
};

export const reverseTranslateMuscleGroup = (frenchGroup: string): string => {
  const reverseTranslations: { [key: string]: string } = {
    'poitrine': 'chest',
    'dos': 'back',
    'jambes': 'legs',
    'épaules': 'shoulders',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'abdominaux': 'abs',
    'bras': 'arms',
    'corps complet': 'full_body',
    'fessiers': 'glutes'
  };
  return reverseTranslations[frenchGroup.toLowerCase()] || frenchGroup;
};