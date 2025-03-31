
export interface WorkoutSession {
  id: string;
  user_id: string;
  program_id?: string;
  total_duration_minutes: number;
  exercises: string[];
  calories_burned: number;
  completed: boolean;
  perceived_difficulty: 'easy' | 'moderate' | 'hard';
  created_at: string;
}

export interface WorkoutSessionUpdate {
  completed?: boolean;
  total_duration_minutes?: number;
  perceived_difficulty?: 'easy' | 'moderate' | 'hard';
  calories_burned?: number;
}
