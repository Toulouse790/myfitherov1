export const translateMuscleGroup = (muscleId: string): string => {
  const translations: { [key: string]: string } = {
    chest: 'pectoraux',
    back: 'dos',
    legs: 'jambes',
    shoulders: 'épaules',
    biceps: 'biceps',
    triceps: 'triceps',
    abdominaux: 'abdominaux',
    abs: 'abdominaux',
    jambes: 'jambes' // Ajout pour gérer le cas où c'est déjà traduit
  };

  console.log('Traduction du groupe musculaire:', muscleId, 'en:', translations[muscleId.toLowerCase()] || muscleId);
  return translations[muscleId.toLowerCase()] || muscleId;
};

export const reverseTranslateMuscleGroup = (frenchName: string): string => {
  const reverseTranslations: { [key: string]: string } = {
    pectoraux: 'chest',
    dos: 'back',
    jambes: 'legs',
    épaules: 'shoulders',
    biceps: 'biceps',
    triceps: 'triceps',
    abdominaux: 'abs'
  };

  return reverseTranslations[frenchName.toLowerCase()] || frenchName;
};