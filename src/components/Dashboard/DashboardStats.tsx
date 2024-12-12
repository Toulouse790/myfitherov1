import { Activity, Dumbbell, Heart } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DetailedStats } from "../Workouts/WorkoutStats/DetailedStats";

export const DashboardStats = () => {
  const { toast } = useToast();

  const { data: trainingStats } = useQuery({
    queryKey: ['training-stats'],
    queryFn: async () => {
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      const { data, error } = await supabase
        .from('training_stats')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      const weeklyStats = data.filter(stat => new Date(stat.created_at) >= startOfWeek);
      const monthlyStats = data.filter(stat => new Date(stat.created_at) >= startOfMonth);
      const yearlyStats = data.filter(stat => new Date(stat.created_at) >= startOfYear);

      const calculateTotalWeight = (stats: any[]) => 
        stats.reduce((acc, stat) => acc + (stat.total_weight_lifted || 0), 0);

      return {
        weeklyWorkouts: weeklyStats.length,
        monthlyWorkouts: monthlyStats.length,
        yearlyWorkouts: yearlyStats.length,
        weeklyWeight: calculateTotalWeight(weeklyStats),
        monthlyWeight: calculateTotalWeight(monthlyStats),
        yearlyWeight: calculateTotalWeight(yearlyStats),
        totalMinutes: data.reduce((acc, stat) => acc + (stat.session_duration_minutes || 0), 0),
        totalCalories: Math.round((data.reduce((acc, stat) => acc + (stat.session_duration_minutes || 0), 0) * 7.5))
      };
    }
  });

  useEffect(() => {
    if (trainingStats?.weeklyWorkouts > 24) {
      toast({
        title: "Attention à votre santé",
        description: "Il est recommandé de ne pas dépasser 6 entraînements par semaine pour permettre une bonne récupération.",
        variant: "destructive",
        duration: 6000,
      });
    }
  }, [trainingStats?.weeklyWorkouts, toast]);

  return (
    <div className="space-y-8">
      {trainingStats?.weeklyWorkouts > 24 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Risque de surentraînement détecté</AlertTitle>
          <AlertDescription>
            Votre fréquence d'entraînement est très élevée. Pensez à inclure suffisamment de repos
            pour permettre à votre corps de récupérer et éviter les blessures.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <DashboardCard
          title="Poids soulevé (semaine)"
          value={`${Math.round(trainingStats?.weeklyWeight || 0)} kg`}
          target={`${Math.round((trainingStats?.weeklyWeight || 0) * 1.1)} kg`}
          icon={<Dumbbell className="w-5 h-5" />}
        />
        <DashboardCard
          title="Poids soulevé (mois)"
          value={`${Math.round(trainingStats?.monthlyWeight || 0)} kg`}
          target={`${Math.round((trainingStats?.monthlyWeight || 0) * 1.1)} kg`}
          icon={<Activity className="w-5 h-5" />}
        />
        <DashboardCard
          title="Poids soulevé (année)"
          value={`${Math.round(trainingStats?.yearlyWeight || 0)} kg`}
          target={`${Math.round((trainingStats?.yearlyWeight || 0) * 1.1)} kg`}
          icon={<Heart className="w-5 h-5" />}
        />
      </div>

      <DetailedStats />
    </div>
  );
};