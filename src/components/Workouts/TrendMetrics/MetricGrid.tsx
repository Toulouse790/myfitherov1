import { MetricCard } from "./MetricCard";
import { MetricData } from "./types";

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
          value={metric.value}
          label={metric.label}
          color={metric.color}
          onClick={() => onMetricClick(metric)}
        />
      ))}
    </div>
  );
};