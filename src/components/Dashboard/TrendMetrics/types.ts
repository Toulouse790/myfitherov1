
import { LucideIcon } from "lucide-react";

export interface MetricData {
  label: string;
  value: string;
  color: string;
  unit: string;
  icon: React.ReactElement;
  history: {
    daily: Array<{ date: string; value: number }>;
    weekly: Array<{ date: string; value: number }>;
    monthly: Array<{ date: string; value: number }>;
  };
}
