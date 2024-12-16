export const translateMuscleGroup = (muscleGroup: string): string => {
  if (!muscleGroup) return '';
  
  // Convertir en minuscules et supprimer les accents
  return muscleGroup
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');
};

export const reverseTranslateMuscleGroup = (muscleGroup: string): string => {
  const translations: { [key: string]: string } = {
    'pectoraux': 'Pectoraux',
    'dos': 'Dos',
    'jambes': 'Jambes',
    'epaules': 'Épaules',
    'biceps': 'Biceps',
    'triceps': 'Triceps',
    'abdominaux': 'Abdominaux'
  };

  const key = muscleGroup.toLowerCase();
  return translations[key] || muscleGroup;
};