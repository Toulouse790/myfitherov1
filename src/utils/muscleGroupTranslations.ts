const muscleGroupTranslations: { [key: string]: string } = {
  chest: 'pectoraux',
  back: 'dos',
  legs: 'jambes',
  shoulders: 'épaules',
  arms: 'bras',
  abs: 'abdominaux',
  cardio: 'cardio'
};

export const translateMuscleGroup = (englishName: string): string => {
  return muscleGroupTranslations[englishName.toLowerCase()] || englishName;
};

export const reverseTranslateMuscleGroup = (frenchName: string): string => {
  const entries = Object.entries(muscleGroupTranslations);
  const found = entries.find(([_, french]) => french.toLowerCase() === frenchName.toLowerCase());
  return found ? found[0] : frenchName;
};