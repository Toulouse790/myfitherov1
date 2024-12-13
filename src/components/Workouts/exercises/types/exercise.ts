export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  muscleGroup: string;
  description: string;
  difficulty: string[];
  equipment: string;
  location: string[];
  image_url?: string;
  video_url?: string;
  instructions: string[];
  targetMuscles: string[];
  objectives: string[];
  sets: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  reps: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  restTime: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  calories: number;
  is_published?: boolean;
}

export const validateExercise = (exercise: Exercise | undefined): exercise is Exercise => {
  if (!exercise) return false;
  
  const requiredFields: (keyof Exercise)[] = [
    'id',
    'name',
    'muscle_group',
    'muscleGroup',
    'description',
    'difficulty',
    'equipment',
    'location',
    'instructions',
    'targetMuscles',
    'objectives',
    'sets',
    'reps',
    'restTime',
    'calories'
  ];

  return requiredFields.every(field => {
    const value = exercise[field];
    if (value === undefined || value === null) {
      console.warn(`Missing required field: ${field}`);
      return false;
    }
    return true;
  });
};