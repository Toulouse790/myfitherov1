const muscleGroupTranslations: { [key: string]: string } = {
  back: 'dos',
  biceps: 'biceps',
  triceps: 'triceps',
  shoulders: 'épaules',
  chest: 'pectoraux',
  abs: 'abdominaux',
  legs: 'jambes',
  calves: 'mollets',
  forearms: 'avant-bras'
};

const reverseMuscleGroupTranslations: { [key: string]: string } = {
  dos: 'back',
  biceps: 'biceps',
  triceps: 'triceps',
  épaules: 'shoulders',
  pectoraux: 'chest',
  abdominaux: 'abs',
  jambes: 'legs',
  mollets: 'calves',
  'avant-bras': 'forearms',
  poitrine: 'chest'  // Ajout de cette traduction pour gérer les deux termes
};

export const translateMuscleGroup = (muscleGroup: string): string => {
  return muscleGroupTranslations[muscleGroup.toLowerCase()] || muscleGroup;
};

export const reverseTranslateMuscleGroup = (muscleGroup: string): string => {
  return reverseMuscleGroupTranslations[muscleGroup.toLowerCase()] || muscleGroup;
};