export const translateMuscleGroup = (muscleId: string): string => {
  const translations: { [key: string]: string } = {
    chest: 'pectoraux',
    back: 'dos',
    legs: 'jambes',
    shoulders: 'épaules',
    biceps: 'biceps',
    triceps: 'triceps',
    abs: 'abdominaux',
    arms: 'bras'
  };

  console.log('Traduction du groupe musculaire:', muscleId, 'en:', translations[muscleId]);
  return translations[muscleId] || muscleId;
};

export const reverseTranslateMuscleGroup = (frenchName: string): string => {
  const reverseTranslations: { [key: string]: string } = {
    pectoraux: 'chest',
    dos: 'back',
    jambes: 'legs',
    épaules: 'shoulders',
    biceps: 'biceps',
    triceps: 'triceps',
    abdominaux: 'abs',
    bras: 'arms'
  };

  return reverseTranslations[frenchName.toLowerCase()] || frenchName;
};