
export interface SleepSession {
  id?: string;
  user_id?: string;
  start_time?: string;
  end_time?: string;
  total_duration_minutes?: number;
  sleep_score?: number;
  is_nap?: boolean;
  quality_metrics?: {
    sleep_quality?: number;
    deep_sleep_duration?: number;
    rem_sleep_duration?: number;
    light_sleep_duration?: number;
    awake_time?: number;
  };
  sleep_stages?: {
    deep?: number;
    light?: number;
    rem?: number;
    awake?: number;
  };
  created_at?: string;
  updated_at?: string;
}
