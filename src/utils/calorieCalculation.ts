// Formule basée sur l'équation de Harris-Benedict et les études sur la dépense énergétique pendant l'exercice
// Source: Journal of Sports Sciences (2004) - Energy Expenditure during Exercise

export const calculateExerciseCalories = (
  weightKg: number,
  durationMinutes: number,
  exerciseIntensity: 'low' | 'moderate' | 'high' = 'moderate',
  gender: 'male' | 'female' = 'male'
): number => {
  // MET (Metabolic Equivalent of Task) values based on exercise intensity
  const metValues = {
    low: 3.0, // Light weight training
    moderate: 5.0, // Moderate weight training
    high: 6.0 // Vigorous weight training
  };

  // Base formula: Calories = MET × Weight (kg) × Duration (hours)
  const met = metValues[exerciseIntensity];
  const durationHours = durationMinutes / 60;
  
  // Gender adjustment factor (women generally burn slightly fewer calories due to lower muscle mass)
  const genderFactor = gender === 'female' ? 0.9 : 1.0;

  // Calculate base calories
  let calories = met * weightKg * durationHours * 3.5;

  // Apply gender adjustment
  calories *= genderFactor;

  // EPOC (Excess Post-exercise Oxygen Consumption) adjustment
  // Add 6-15% additional calories for the afterburn effect
  const epocFactor = exerciseIntensity === 'high' ? 1.15 : 
                     exerciseIntensity === 'moderate' ? 1.10 : 1.06;
  
  calories *= epocFactor;

  return Math.round(calories);
};