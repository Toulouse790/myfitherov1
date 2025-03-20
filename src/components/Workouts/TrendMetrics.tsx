
import { useState } from "react";
import { MetricHistoryDialog } from "@/components/Dashboard/MetricHistoryDialog";
import { useMetricData } from "./TrendMetrics/useMetricData";
import { MetricHeader } from "./TrendMetrics/MetricHeader";
import { MetricGrid } from "./TrendMetrics/MetricGrid";
import { MetricData } from "./TrendMetrics/types";

export const TrendMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null);
  const [days, setDays] = useState<number>(7);
  const { data: stats, isLoading } = useMetricData(days);

  const calculateTotalValue = (data: any[] = []) => {
    return data.reduce((acc, curr) => acc + (curr.value || 0), 0);
  };

  const handlePeriodChange = (newDays: number) => {
    setDays(newDays);
  };

  const getPeriodLabel = () => {
    switch (days) {
      case 14:
        return "14 derniers jours";
      case 30:
        return "30 derniers jours";
      default:
        return "7 derniers jours";
    }
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
        <MetricHeader 
          title="Tendances" 
          period={getPeriodLabel()} 
          onPeriodChange={handlePeriodChange}
        />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800 dark:bg-gray-800 rounded-md h-24 p-4">
                <div className="bg-gray-700 dark:bg-gray-700 h-3 w-20 rounded mb-3"></div>
                <div className="bg-gray-700 dark:bg-gray-700 h-5 w-14 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <MetricHeader 
        title="Tendances" 
        period={getPeriodLabel()} 
        onPeriodChange={handlePeriodChange}
      />
      <MetricGrid metrics={metrics} onMetricClick={setSelectedMetric} />

      <MetricHistoryDialog
        open={selectedMetric !== null}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        metric={selectedMetric || metrics[0]}
      />
    </div>
  );
};
