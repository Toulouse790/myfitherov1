import { MetricCard } from "./MetricCard";
import type { MetricData } from "./types";

interface MetricGridProps {
  metrics: MetricData[];
  onMetricClick: (metric: MetricData) => void;
}

export const MetricGrid = ({ metrics, onMetricClick }: MetricGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {metrics.map((metric, index) => (
        <MetricCard 
          key={index} 
          metric={metric}
          onClick={() => onMetricClick(metric)}
        />
      ))}
    </div>
  );
};