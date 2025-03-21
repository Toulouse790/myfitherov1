
export const mapObjectiveToProfile = (objective: string): string => {
  const objectiveMap: { [key: string]: string } = {
    'weight_loss': 'perte_de_poids',
    'muscle_gain': 'prise_de_masse',
    'maintenance': 'maintenance'
  };
  return objectiveMap[objective] || objective;
};

export const validateStep = (step: number, responses: any): boolean => {
  switch (step) {
    case 1:
      return !!responses.gender;
    case 2:
      // Validation physiologique:
      // Âge: entre 18 et 100 ans (restriction d'âge légale)
      // Poids: entre 30 et 300 kg (valeurs médicalement plausibles)
      // Taille: entre 130 et 250 cm (valeurs médicalement plausibles)
      return (
        !!responses.age && 
        responses.age >= 18 && 
        responses.age <= 100 &&
        !!responses.weight && 
        responses.weight >= 30 && 
        responses.weight <= 300 &&
        !!responses.height && 
        responses.height >= 130 && 
        responses.height <= 250
      );
    case 3:
      return !!responses.objective;
    case 4:
      return !!responses.training_frequency && !!responses.workout_duration;
    case 5:
      return !!responses.experience_level;
    case 6:
      return Array.isArray(responses.available_equipment) && responses.available_equipment.length > 0;
    case 7:
      return !!responses.diet_type;
    default:
      return false;
  }
};

// Fonction pour obtenir le message d'erreur de validation
export const getValidationMessage = (step: number, responses: any): string | null => {
  if (step === 2) {
    if (!responses.age || responses.age < 18) {
      return "Vous devez avoir au moins 18 ans pour utiliser cette application";
    }
    if (responses.age > 100) {
      return "Veuillez entrer un âge valide (maximum 100 ans)";
    }
    if (!responses.weight || responses.weight < 30) {
      return "Le poids minimum accepté est de 30 kg";
    }
    if (responses.weight > 300) {
      return "Le poids maximum accepté est de 300 kg";
    }
    if (!responses.height || responses.height < 130) {
      return "La taille minimum acceptée est de 130 cm";
    }
    if (responses.height > 250) {
      return "La taille maximum acceptée est de 250 cm";
    }
  }
  return null;
};
