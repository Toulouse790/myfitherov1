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
  épaules: 'shoulders',
  biceps: 'biceps',
  triceps: 'triceps',
  abdominaux: 'abs',
  jambes: 'legs',
  mollets: 'calves',
  'avant-bras': 'forearms'
};

export const translateMuscleGroup = (muscleGroup: string): string => {
  return muscleGroupTranslations[muscleGroup] || muscleGroup;
};

export const reverseTranslateMuscleGroup = (muscleGroup: string): string => {
  return reverseMuscleGroupTranslations[muscleGroup] || muscleGroup;
};