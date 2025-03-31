
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
  completed_at?: string;
  type?: string;
  workout_type?: string;
}

export type WorkoutSessionUpdate = Partial<Omit<WorkoutSession, 'id' | 'user_id' | 'created_at'>>;
