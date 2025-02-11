
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
      return !!responses.age && !!responses.weight && !!responses.height;
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
