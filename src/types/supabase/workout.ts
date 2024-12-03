export interface WorkoutSession {
  id: string;
  user_id: string | null;
  started_at: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface WorkoutSessionInsert {
  user_id?: string | null;
  started_at?: string | null;
  status?: string | null;
}

export interface WorkoutSessionUpdate {
  started_at?: string | null;
  status?: string | null;
}