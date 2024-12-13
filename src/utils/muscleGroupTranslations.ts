const muscleGroupTranslations: { [key: string]: string } = {
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

export const translateMuscleGroup = (group: string): string => {
  const normalizedGroup = group.toLowerCase();
  return muscleGroupTranslations[normalizedGroup] || normalizedGroup;
};

export const reverseTranslateMuscleGroup = (group: string): string => {
  const normalizedGroup = group.toLowerCase();
  const entries = Object.entries(muscleGroupTranslations);
  const translation = entries.find(([key, value]) => value.toLowerCase() === normalizedGroup);
  return translation ? translation[0] : normalizedGroup;
};