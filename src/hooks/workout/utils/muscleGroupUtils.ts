export const normalizeMuscleGroup = (group: string): string => {
  if (!group) return '';
  
  // Convert to lowercase, remove accents, and replace special characters with underscores
  const normalized = group
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '_') // Replace special chars with underscore
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .replace(/_+/g, '_'); // Replace multiple underscores with single

  return normalized;
};

export const calculateRecoveryStatus = (
  lastTrainingDate: Date | null,
  recoveryHours: number
): { status: 'recovered' | 'partial' | 'fatigued'; remainingHours: number } => {
  if (!lastTrainingDate) {
    return { status: 'recovered', remainingHours: 0 };
  }

  const now = new Date();
  const timeDiffHours = (now.getTime() - lastTrainingDate.getTime()) / (1000 * 60 * 60);
  const remainingHours = Math.max(0, recoveryHours - timeDiffHours);

  if (remainingHours <= 0) {
    return { status: 'recovered', remainingHours: 0 };
  } else if (remainingHours < recoveryHours / 2) {
    return { status: 'partial', remainingHours: Math.ceil(remainingHours) };
  } else {
    return { status: 'fatigued', remainingHours: Math.ceil(remainingHours) };
  }
};

export const calculateRecoveryHours = (
  baseRecoveryHours: number,
  intensity: number,
  sessionDuration: number
): number => {
  // Adjust recovery time based on intensity and duration
  const intensityFactor = 1 + (intensity - 0.5);  // 0.5 is considered moderate intensity
  const durationFactor = Math.max(1, sessionDuration / 60);  // Normalize to hours, minimum 1
  
  return Math.round(baseRecoveryHours * intensityFactor * durationFactor);
};