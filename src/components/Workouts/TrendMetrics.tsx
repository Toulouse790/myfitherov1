import { useState } from "react";
import { MetricHistoryDialog } from "./MetricHistoryDialog";
import { useMetricData } from "./TrendMetrics/useMetricData";
import { MetricHeader } from "./TrendMetrics/MetricHeader";
import { MetricGrid } from "./TrendMetrics/MetricGrid";
import { MetricData } from "./TrendMetrics/types";

export const TrendMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null);
  const { data: stats } = useMetricData(7);

  const metrics: MetricData[] = [
    { 
      label: "Entraînements", 
      value: stats?.daily.length.toString() || "0", 
      color: "text-blue-400",
      unit: "séances",
      history: stats || { daily: [], weekly: [], monthly: [] }
    },
    { 
      label: "Volume total", 
      value: "31 209", 
      color: "text-cyan-400",
      unit: "kg",
      history: stats || { daily: [], weekly: [], monthly: [] }
    },
    { 
      label: "Calories", 
      value: "1 506", 
      color: "text-pink-400",
      unit: "kcal",
      history: stats || { daily: [], weekly: [], monthly: [] }
    },
    { 
      label: "Séries", 
      value: "91", 
      color: "text-purple-400",
      unit: "séries",
      history: stats || { daily: [], weekly: [], monthly: [] }
    }
  ];

  return (
    <div className="space-y-3">
      <MetricHeader title="Tendances" period="7 derniers jours" />
      <MetricGrid metrics={metrics} onMetricClick={setSelectedMetric} />

      <MetricHistoryDialog
        open={selectedMetric !== null}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        metric={selectedMetric || metrics[0]}
      />
    </div>
  );
};