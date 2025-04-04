
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

// Ajout des nouvelles interfaces requises
export interface SleepQualityMetrics {
  sleep_quality: number;
  deep_sleep_percentage?: number;
  rem_sleep_percentage?: number;
  light_sleep_percentage?: number;
  awake_time_minutes?: number;
  wake_count?: number;
}

export interface EnvironmentalData {
  temperature: number;
  noise_level: number;
  light_level: number;
  humidity?: number;
}

export interface SleepDevice {
  id: string;
  name: string;
  type: string;
  batteryLevel: number;
  lastSync: string;
  connected: boolean;
}

export interface SleepStats {
  average_duration: number;
  average_score: number;
  sleep_debt_minutes?: number;
  weekly_trend?: number;
  consistency_score?: number;
}

export interface SleepRecommendation {
  hours: number;
  minutes: number;
}
