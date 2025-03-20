
import { useState } from "react";
import { MetricHistoryDialog } from "@/components/Dashboard/MetricHistoryDialog";
import { useMetricData } from "./TrendMetrics/useMetricData";
import { MetricHeader } from "./TrendMetrics/MetricHeader";
import { MetricGrid } from "./TrendMetrics/MetricGrid";
import { MetricData } from "./TrendMetrics/types";

export const TrendMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null);
  const { data: stats, isLoading } = useMetricData(7);

  const calculateTotalValue = (data: any[] = []) => {
    return data.reduce((acc, curr) => acc + (curr.value || 0), 0);
  };

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
      value: calculateTotalValue(stats?.daily).toString(),
      color: "text-cyan-400",
      unit: "kg",
      history: stats || { daily: [], weekly: [], monthly: [] }
    },
    { 
      label: "Calories", 
      value: Math.round(calculateTotalValue(stats?.daily) * 0.5).toString(),
      color: "text-pink-400",
      unit: "kcal",
      history: stats || { daily: [], weekly: [], monthly: [] }
    },
    { 
      label: "Séries", 
      value: stats?.daily.length > 0 ? Math.round(calculateTotalValue(stats?.daily) / (stats.daily.length * 20)).toString() : "0",
      color: "text-purple-400",
      unit: "séries",
      history: stats || { daily: [], weekly: [], monthly: [] }
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-3">
        <MetricHeader title="Tendances" period="7 derniers jours" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-md h-24 p-4">
                <div className="bg-muted-foreground/20 h-3 w-20 rounded mb-3"></div>
                <div className="bg-muted-foreground/20 h-5 w-14 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
