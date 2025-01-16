import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MetricHistoryDialog } from "./MetricHistoryDialog";
import { MetricHeader } from "./TrendMetrics/MetricHeader";
import { MetricGrid } from "./TrendMetrics/MetricGrid";
import type { MetricData } from "./TrendMetrics/types";

const getMetricHistory = async (days: number) => {
  const { data, error } = await supabase
    .from('training_stats')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(days);

  if (error) throw error;

  const dailyData = data.map(stat => ({
    date: new Date(stat.created_at).toLocaleDateString(),
    value: stat.session_duration_minutes
  }));

  const weeklyData = Array.from({ length: 4 }, (_, i) => ({
    date: `S-${3-i}`,
    value: Math.floor(Math.random() * 400)
  }));

  const monthlyData = Array.from({ length: 6 }, (_, i) => ({
    date: `M-${5-i}`,
    value: Math.floor(Math.random() * 1200)
  }));

  return {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData
  };
};

export const TrendMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null);

  const { data: stats } = useQuery({
    queryKey: ['trend-metrics'],
    queryFn: () => getMetricHistory(7)
  });

  const metrics: MetricData[] = [
    { 
      label: "Entraînements", 
      value: stats?.daily.length.toString() || "0", 
      color: "text-blue-400",
      unit: "séances",
      history: stats || { daily: [], weekly: [], monthly: [] }
    },
    { 
      label: "Durée totale", 
      value: `${stats?.daily.reduce((acc, curr) => acc + curr.value, 0) || 0}`, 
      color: "text-cyan-400",
      unit: "min",
      history: stats || { daily: [], weekly: [], monthly: [] }
    },
    { 
      label: "Temps de repos moyen", 
      value: "90", 
      color: "text-pink-400",
      unit: "sec",
      history: stats || { daily: [], weekly: [], monthly: [] }
    },
    { 
      label: "Séances complétées", 
      value: stats?.daily.length.toString() || "0", 
      color: "text-purple-400",
      unit: "séances",
      history: stats || { daily: [], weekly: [], monthly: [] }
    }
  ];

  return (
    <div className="space-y-3">
      <MetricHeader />
      <MetricGrid metrics={metrics} onMetricClick={setSelectedMetric} />
      <MetricHistoryDialog
        open={selectedMetric !== null}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        metric={selectedMetric || metrics[0]}
      />
    </div>
  );
};