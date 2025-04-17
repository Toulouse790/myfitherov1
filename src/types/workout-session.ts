
export interface WorkoutSession {
  id: string;
  user_id: string;
  program_id?: string;
  created_at: string;
  updated_at?: string;
  exercises: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  total_duration_minutes: number;
  calories_burned?: number;
  perceived_difficulty?: 'easy' | 'moderate' | 'hard';
  type?: string;
  workout_type?: string;
}

export type WorkoutSessionUpdate = Partial<Omit<WorkoutSession, 'id' | 'user_id' | 'created_at'>>;

export interface SportTrainingRecommendation {
  primaryExercises: string[];
  secondaryExercises: string[];
  performanceMetrics: Record<string, number>;
  nutritionGuidelines: {
    proteinIntake: number; // g/kg de poids corporel
    carbohydrateIntake: number; // g/kg de poids corporel
    hydrationNeeds: string;
  };
  sleepRecommendations: {
    minHours: number;
    recoveryFocus: string[];
  };
}

export interface SportPosition {
  id: string;
  name: string;
  sport_id: string;
  performance_metrics?: Record<string, any>;
  recommended_exercises?: any;
}

export interface Sport {
  id: string;
  name: string;
  type: string;
  category?: string;
}
