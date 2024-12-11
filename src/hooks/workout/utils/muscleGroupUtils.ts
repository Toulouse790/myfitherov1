export const normalizeMuscleGroup = (group: string): string => {
  // Convertir en minuscules et supprimer les accents
  return group
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remplacer les espaces par des underscores
    .replace(/\s+/g, '_');
};

export const calculateRecoveryStatus = (
  lastTrainingDate: Date | null,
  estimatedRecoveryHours: number
): { status: 'recovered' | 'partial' | 'fatigued'; remainingHours: number } => {
  if (!lastTrainingDate) {
    return { status: 'recovered', remainingHours: 0 };
  }

  const hoursSinceTraining = Math.floor(
    (Date.now() - lastTrainingDate.getTime()) / (1000 * 60 * 60)
  );
  const remainingHours = Math.max(0, estimatedRecoveryHours - hoursSinceTraining);

  if (remainingHours === 0) {
    return { status: 'recovered', remainingHours: 0 };
  } else if (remainingHours < estimatedRecoveryHours / 2) {
    return { status: 'partial', remainingHours };
  } else {
    return { status: 'fatigued', remainingHours };
  }
};

export const calculateRecoveryHours = (
  baseRecovery: number,
  intensity: number,
  sessionDuration: number
): number => {
  const intensityFactor = intensity > 0.8 ? 1.2 : intensity > 0.6 ? 1 : 0.8;
  const durationFactor = sessionDuration > 60 ? 1.2 : 1;
  return Math.round(baseRecovery * intensityFactor * durationFactor);
};