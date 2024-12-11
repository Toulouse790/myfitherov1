// Fonction pour traduire les noms de groupes musculaires du français vers l'anglais
export const reverseTranslateMuscleGroup = (frenchName: string): string => {
  const translations: { [key: string]: string } = {
    'pectoraux': 'chest',
    'dos': 'back',
    'jambes': 'legs',
    'épaules': 'shoulders',
    'biceps': 'biceps',
    'triceps': 'triceps',
    'abdominaux': 'abs'
  };

  return translations[frenchName.toLowerCase()] || frenchName.toLowerCase();
};

// Fonction pour traduire les noms de groupes musculaires de l'anglais vers le français
export const translateMuscleGroup = (englishName: string): string => {
  const translations: { [key: string]: string } = {
    'chest': 'Pectoraux',
    'back': 'Dos',
    'legs': 'Jambes',
    'shoulders': 'Épaules',
    'biceps': 'Biceps',
    'triceps': 'Triceps',
    'abs': 'Abdominaux'
  };

  return translations[englishName.toLowerCase()] || englishName;
};