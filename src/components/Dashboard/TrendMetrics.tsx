
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MetricHistoryDialog } from "./MetricHistoryDialog";
import { MetricHeader } from "./TrendMetrics/MetricHeader";
import { MetricGrid } from "./TrendMetrics/MetricGrid";
import type { MetricData } from "./TrendMetrics/types";
import { Activity, Dumbbell, Target, Timer, Flame, ArrowUpRight, Barbell, Medal } from "lucide-react";

export const TrendMetrics = () => {
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null);
  const [days, setDays] = useState<number>(7);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['trend-metrics', days],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const now = new Date();
      const startDate = new Date();
      startDate.setDate(now.getDate() - days);

      const { data: trainingStats } = await supabase
        .from('training_stats')
        .select('*, workout_sessions(total_duration_minutes)')
        .gte('created_at', startDate.toISOString())
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      return trainingStats || [];
    }
  });

  if (isLoading || !stats) {
    return (
      <div className="space-y-3">
        <MetricHeader title="Tendances" period={`${days} derniers jours`} onPeriodChange={setDays} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-card rounded-lg p-4 h-24">
                <div className="h-2 bg-muted rounded w-16 mb-4"></div>
                <div className="h-4 bg-muted rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const calculateMetrics = () => {
    const totalWeight = stats.reduce((acc, stat) => acc + (stat.total_weight_lifted || 0), 0);
    const totalSessions = stats.length;
    const totalMinutes = stats.reduce((acc, stat) => {
      return acc + (stat.workout_sessions?.total_duration_minutes || 0);
    }, 0);
    const avgSessionDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
    const avgWeightPerSession = totalSessions > 0 ? Math.round(totalWeight / totalSessions) : 0;

    // Calcul de l'intensité moyenne basée sur le poids et la durée
    const avgIntensity = stats.reduce((acc, stat) => {
      const sessionIntensity = (stat.total_weight_lifted || 0) / (stat.workout_sessions?.total_duration_minutes || 1);
      return acc + sessionIntensity;
    }, 0) / (totalSessions || 1);

    const metrics: MetricData[] = [
      {
        label: "Volume total",
        value: `${Math.round(totalWeight)}`,
        color: "text-blue-500",
        unit: "kg",
        icon: <Dumbbell className="w-4 h-4" />,
        history: { daily: [], weekly: [], monthly: [] },
        importance: "primary",
        description: "Poids total soulevé pendant la période"
      },
      {
        label: "Séances",
        value: totalSessions.toString(),
        color: "text-green-500",
        unit: "séances",
        icon: <Activity className="w-4 h-4" />,
        history: { daily: [], weekly: [], monthly: [] },
        importance: "primary",
        description: "Nombre total de séances d'entraînement"
      },
      {
        label: "Durée moyenne",
        value: avgSessionDuration.toString(),
        color: "text-orange-500",
        unit: "min",
        icon: <Timer className="w-4 h-4" />,
        history: { daily: [], weekly: [], monthly: [] },
        importance: "secondary",
        description: "Durée moyenne par séance d'entraînement"
      },
      {
        label: "Calories brûlées",
        value: Math.round(totalMinutes * 7.5).toString(),
        color: "text-red-500",
        unit: "kcal",
        icon: <Flame className="w-4 h-4" />,
        history: { daily: [], weekly: [], monthly: [] },
        importance: "secondary",
        description: "Estimation des calories brûlées pendant les séances"
      }
    ];

    // Ajout conditionnel de métriques supplémentaires si totalSessions > 0
    if (totalSessions > 0) {
      metrics.push(
        {
          label: "Intensité moy.",
          value: Math.round(avgIntensity).toString(),
          color: "text-purple-500",
          unit: "kg/min",
          icon: <ArrowUpRight className="w-4 h-4" />,
          history: { daily: [], weekly: [], monthly: [] },
          importance: "tertiary",
          description: "Rapport entre le poids soulevé et la durée de l'entraînement"
        },
        {
          label: "Poids moy/séance",
          value: avgWeightPerSession.toString(),
          color: "text-cyan-500",
          unit: "kg",
          icon: <Barbell className="w-4 h-4" />,
          history: { daily: [], weekly: [], monthly: [] },
          importance: "tertiary",
          description: "Poids moyen soulevé par séance"
        }
      );
    }

    // Ajout conditionnel des métriques d'objectif si days >= 7
    if (days >= 7) {
      metrics.push({
        label: "Objectif hebdo",
        value: `${Math.round((totalSessions / days) * 7)}`,
        color: "text-indigo-500",
        unit: "séances",
        icon: <Target className="w-4 h-4" />,
        history: { daily: [], weekly: [], monthly: [] },
        importance: "tertiary",
        description: "Projection du nombre de séances sur une semaine"
      });
    }

    return metrics;
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-3">
      <MetricHeader 
        title="Tendances" 
        period={`${days} derniers jours`}
        onPeriodChange={setDays}
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
