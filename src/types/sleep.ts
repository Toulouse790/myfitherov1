
export interface SleepSession {
  id?: string;
  user_id?: string;
  start_time: string;
  end_time: string;
  total_duration_minutes: number;
  quality_metrics: SleepQualityMetrics;
  environmental_data: EnvironmentalData;
  sleep_score?: number;
  is_nap?: boolean;
}

export interface SleepQualityMetrics {
  sleep_quality: number; // 1-10
  deep_sleep_percentage: number;
  rem_sleep_percentage: number;
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

export interface SleepStats {
  average_duration: number;
  average_score: number;
  sleep_debt_minutes: number;
  weekly_trend: number; // positif = amélioration
  consistency_score: number;
}

export interface SleepDevice {
  id: string;
  name: string;
  type: string;
  batteryLevel: number;
  lastSync?: string;
  connected: boolean;
}

export interface SleepRecommendation {
  hours: number;
  minutes: number;
}
