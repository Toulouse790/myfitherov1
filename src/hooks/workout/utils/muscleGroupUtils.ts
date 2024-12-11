export const normalizeMuscleGroup = (name: string): string => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');
};

export const calculateRecoveryStatus = (
  lastTrainingDate: Date | null,
  estimatedRecoveryHours: number
) => {
  if (!lastTrainingDate) {
    return { status: 'recovered' as const, remainingHours: 0 };
  }

  const now = new Date();
  const hoursSinceTraining = (now.getTime() - lastTrainingDate.getTime()) / (1000 * 60 * 60);
  const remainingHours = Math.max(0, estimatedRecoveryHours - hoursSinceTraining);

  if (remainingHours <= 0) {
    return { status: 'recovered' as const, remainingHours: 0 };
  } else if (remainingHours <= estimatedRecoveryHours / 2) {
    return { status: 'partial' as const, remainingHours: Math.round(remainingHours) };
  } else {
    return { status: 'fatigued' as const, remainingHours: Math.round(remainingHours) };
  }
};