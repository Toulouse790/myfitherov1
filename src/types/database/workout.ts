export interface WorkoutSession {
  created_at: string | null;
  id: string;
  started_at: string | null;
  status: string | null;
  updated_at: string | null;
  user_id: string | null;
}

export interface WorkoutSessionInsert {
  created_at?: string | null;
  id?: string;
  started_at?: string | null;
  status?: string | null;
  updated_at?: string | null;
  user_id?: string | null;
}

export interface WorkoutSessionUpdate {
  created_at?: string | null;
  id?: string;
  started_at?: string | null;
  status?: string | null;
  updated_at?: string | null;
  user_id?: string | null;
}