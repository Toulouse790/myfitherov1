export interface MetricData {
  label: string;
  value: string;
  color: string;
  unit: string;
  history: {
    daily: Array<{ date: string; value: number }>;
    weekly: Array<{ date: string; value: number }>;
    monthly: Array<{ date: string; value: number }>;
  };
}