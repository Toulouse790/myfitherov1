export const translateMuscleGroup = (group: string): string => {
  const translations: { [key: string]: string } = {
    'chest': 'poitrine',
    'back': 'dos',
    'legs': 'jambes',
    'shoulders': 'épaules',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'abs': 'abdominaux'
  };
  return translations[group] || group;
};