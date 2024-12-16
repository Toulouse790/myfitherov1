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
  objectives: ("muscle_gain" | "maintenance" | "weight_loss" | "endurance")[];
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
  est_publié?: boolean;
  is_published?: boolean;
}

export const validateExercise = (exercise: Exercise | undefined): exercise is Exercise => {
  if (!exercise) {
    console.warn('Exercise is undefined');
    return false;
  }
  
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

  const validObjectives = ["muscle_gain", "maintenance", "weight_loss", "endurance"] as const;

  const missingFields = requiredFields.filter(field => {
    const value = exercise[field];
    if (value === undefined || value === null) {
      console.warn(`Missing required field: ${field}`);
      return true;
    }
    return false;
  });

  if (missingFields.length > 0) {
    console.warn('Missing fields:', missingFields);
    return false;
  }

  if (!Array.isArray(exercise.difficulty)) {
    console.warn('difficulty must be an array');
    return false;
  }

  if (!Array.isArray(exercise.location)) {
    console.warn('location must be an array');
    return false;
  }

  if (!Array.isArray(exercise.objectives)) {
    console.warn('objectives must be an array');
    return false;
  }

  const hasInvalidObjective = exercise.objectives.some(
    obj => !validObjectives.includes(obj as typeof validObjectives[number])
  );

  if (hasInvalidObjective) {
    console.warn('Invalid objective found. Valid objectives are:', validObjectives);
    return false;
  }

  return true;
};