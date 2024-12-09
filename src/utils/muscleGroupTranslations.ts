export const muscleGroupTranslations: { [key: string]: string } = {
  chest: 'pectoraux',
  back: 'dos',
  legs: 'jambes',
  shoulders: 'épaules',
  biceps: 'biceps',
  triceps: 'triceps',
  abs: 'abdominaux',
  calves: 'mollets',
  forearms: 'avant-bras'
};

export const reverseMuscleGroupTranslations: { [key: string]: string } = {
  pectoraux: 'chest',
  dos: 'back',
  jambes: 'legs',
  épaules: 'shoulders',
  biceps: 'biceps',
  triceps: 'triceps',
  abdominaux: 'abs',
  mollets: 'calves',
  'avant-bras': 'forearms'
};

export const translateMuscleGroup = (muscleGroup: string): string => {
  return muscleGroupTranslations[muscleGroup.toLowerCase()] || muscleGroup;
};

export const reverseTranslateMuscleGroup = (muscleGroup: string): string => {
  const translation = reverseMuscleGroupTranslations[muscleGroup.toLowerCase()];
  console.log(`Translating muscle group: ${muscleGroup} -> ${translation}`);
  return translation || muscleGroup;
};