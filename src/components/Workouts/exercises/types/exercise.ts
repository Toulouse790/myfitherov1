export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  muscleGroup?: string; // Pour la rétrocompatibilité
  description: string;
  difficulty: string[];
  equipment: string;
  location: string[];
  image_url?: string;
  video_url?: string;
  instructions: string[];
  targetMuscles?: string[];
  objectives?: ("weight_loss" | "muscle_gain" | "maintenance" | "endurance")[];
  sets?: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  reps?: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  restTime?: {
    beginner: number;
    intermediate: number;
    advanced: number;
  };
  calories?: number;
  is_published?: boolean;
}

// Fonction utilitaire pour valider un exercice
export function validateExercise(exercise: Partial<Exercise>): exercise is Exercise {
  const requiredFields = ['id', 'name', 'muscle_group', 'difficulty', 'equipment', 'location', 'description'];
  
  for (const field of requiredFields) {
    if (!(field in exercise)) {
      console.error(`Missing required field in exercise ${exercise.name || 'unknown'}: ${field}`);
      return false;
    }
  }

  return true;
}