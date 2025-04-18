
import { MetricCard } from "./MetricCard";
import type { MetricData } from "./types";

interface MetricGridProps {
  metrics: MetricData[];
  onMetricClick: (metric: MetricData) => void;
}

export const MetricGrid = ({ metrics, onMetricClick }: MetricGridProps) => {
  // Séparer les métriques par importance
  const primaryMetrics = metrics.filter(m => m.importance === "primary");
  const secondaryMetrics = metrics.filter(m => m.importance === "secondary");
  const tertiaryMetrics = metrics.filter(m => m.importance === "tertiary");
  
  return (
    <div className="space-y-3">
      {/* Métriques primaires - format 2x2 */}
      {primaryMetrics.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {primaryMetrics.map((metric, index) => (
            <MetricCard 
              key={`primary-${index}`}
              metric={metric}
              onClick={() => onMetricClick(metric)}
            />
          ))}
        </div>
      )}
      
      {/* Métriques secondaires - format flexible */}
      {secondaryMetrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {secondaryMetrics.map((metric, index) => (
            <MetricCard 
              key={`secondary-${index}`}
              metric={metric}
              onClick={() => onMetricClick(metric)}
            />
          ))}
        </div>
      )}
      
      {/* Métriques tertiaires - format grille plus dense */}
      {tertiaryMetrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tertiaryMetrics.map((metric, index) => (
            <MetricCard 
              key={`tertiary-${index}`}
              metric={metric}
              onClick={() => onMetricClick(metric)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
