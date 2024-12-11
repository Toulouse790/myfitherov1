export const normalizeMuscleGroup = (muscleGroup: string): string => {
  if (!muscleGroup) return '';
  
  return muscleGroup
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove accents
    .replace(/[^a-z0-9]/g, '_')       // Replace non-alphanumeric with underscore
    .replace(/_+/g, '_')              // Replace multiple underscores with single
    .replace(/^_|_$/g, '');           // Remove leading/trailing underscores
};

export const calculateRecoveryStatus = (
  lastTrainingDate: Date | null,
  estimatedRecoveryHours: number
): { status: 'recovered' | 'partial' | 'fatigued'; remainingHours: number } => {
  if (!lastTrainingDate) {
    return { status: 'recovered', remainingHours: 0 };
  }

  const now = new Date();
  const hoursSinceTraining = (now.getTime() - lastTrainingDate.getTime()) / (1000 * 60 * 60);
  const remainingHours = Math.max(0, estimatedRecoveryHours - hoursSinceTraining);

  if (remainingHours <= 0) {
    return { status: 'recovered', remainingHours: 0 };
  } else if (remainingHours <= estimatedRecoveryHours / 2) {
    return { status: 'partial', remainingHours: Math.round(remainingHours) };
  } else {
    return { status: 'fatigued', remainingHours: Math.round(remainingHours) };
  }
};

export const calculateRecoveryHours = (
  baseRecovery: number,
  intensity: number,
  sessionDuration: number
): number => {
  // Adjust recovery time based on intensity and duration
  const intensityFactor = 1 + (intensity - 0.5);  // 0.5 is considered moderate intensity
  const durationFactor = Math.max(1, sessionDuration / 60);  // Normalize to hours, minimum 1
  
  return Math.round(baseRecovery * intensityFactor * durationFactor);
};