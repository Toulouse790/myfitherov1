// Fonction pour traduire les noms de groupes musculaires du français vers l'anglais
export const reverseTranslateMuscleGroup = (frenchName: string): string => {
  const translations: { [key: string]: string } = {
    'Pectoraux': 'chest',
    'Dos': 'back',
    'Jambes': 'legs',
    'Épaules': 'shoulders',
    'Biceps': 'biceps',
    'Triceps': 'triceps',
    'Abdominaux': 'abs'
  };

  return translations[frenchName] || frenchName;
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

  return translations[englishName] || englishName;
};