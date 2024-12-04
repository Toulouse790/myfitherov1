import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { MetricHistoryDialog } from "./MetricHistoryDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const getMetricHistory = async (days: number) => {
  const { data, error } = await supabase
    .from('training_stats')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(days);

  if (error) throw error;

  const dailyData = data.map(stat => ({
    date: new Date(stat.created_at).toLocaleDateString(),
    value: stat.total_sets
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
  const [selectedMetric, setSelectedMetric] = useState<typeof metrics[0] | null>(null);

  const { data: stats } = useQuery({
    queryKey: ['trend-metrics'],
    queryFn: () => getMetricHistory(7)
  });

  const metrics = [
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Tendances</h2>
        <button className="text-gray-400 flex items-center gap-1 text-sm">
          7 derniers jours
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <Card 
            key={index} 
            className="bg-[#1E2330] p-4 cursor-pointer hover:bg-[#252B3B] transition-all duration-300"
            onClick={() => setSelectedMetric(metric)}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </span>
                <p className="text-gray-400">{metric.label}</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        ))}
      </div>

      <MetricHistoryDialog
        open={selectedMetric !== null}
        onOpenChange={(open) => !open && setSelectedMetric(null)}
        metric={selectedMetric || metrics[0]}
      />
    </div>
  );
};