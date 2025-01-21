import { Activity, Dumbbell, Heart, Target, Trophy, Star } from "lucide-react";
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

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: trainingStats } = await supabase
        .from('training_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const { data: profile } = await supabase
        .from('profiles')
        .select('points, level')
        .eq('id', user.id)
        .single();

      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      const { data, error } = await supabase
        .from('training_stats')
        .select(`
          *,
          workout_sessions (
            total_duration_minutes,
            initial_energy_level
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;

      const weeklyStats = data.filter(stat => new Date(stat.created_at) >= startOfWeek);
      const monthlyStats = data.filter(stat => new Date(stat.created_at) >= startOfMonth);
      const yearlyStats = data.filter(stat => new Date(stat.created_at) >= startOfYear);

      const calculateTotalWeight = (stats: any[]) => 
        stats.reduce((acc, stat) => acc + (stat.total_weight_lifted || 0), 0);

      return {
        profile,
        trainingStats: trainingStats?.[0],
        weeklyWorkouts: weeklyStats.length,
        monthlyWorkouts: monthlyStats.length,
        yearlyWorkouts: yearlyStats.length,
        weeklyWeight: calculateTotalWeight(weeklyStats),
        monthlyWeight: calculateTotalWeight(monthlyStats),
        yearlyWeight: calculateTotalWeight(yearlyStats),
        totalMinutes: data.reduce((acc, stat) => {
          const session = stat.workout_sessions;
          return acc + (session?.total_duration_minutes || 0);
        }, 0),
        totalCalories: Math.round((data.reduce((acc, stat) => {
          const session = stat.workout_sessions;
          return acc + (session?.total_duration_minutes || 0);
        }, 0) * 7.5))
      };
    }
  });

  useEffect(() => {
    if (stats?.weeklyWorkouts > 24) {
      toast({
        title: "Attention à votre santé",
        description: "Il est recommandé de ne pas dépasser 6 entraînements par semaine pour permettre une bonne récupération.",
        variant: "destructive",
        duration: 6000,
      });
    }
  }, [stats?.weeklyWorkouts, toast]);

  return (
    <div className="space-y-8">
      {stats?.weeklyWorkouts > 24 && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Risque de surentraînement détecté</AlertTitle>
          <AlertDescription>
            Votre fréquence d'entraînement est très élevée. Pensez à inclure suffisamment de repos
            pour permettre à votre corps de récupérer et éviter les blessures.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Objectif du jour"
          value={`${stats?.trainingStats?.session_duration_minutes || 0} min`}
          target="45 min"
          icon={<Target className="w-4 h-4" />}
        />
        <DashboardCard
          title="Niveau actuel"
          value={stats?.profile?.level?.toString() || "1"}
          target={(stats?.profile?.level ? stats.profile.level + 1 : 2).toString()}
          icon={<Trophy className="w-4 h-4" />}
        />
        <DashboardCard
          title="Points gagnés"
          value={stats?.profile?.points?.toString() || "0"}
          target="1000"
          icon={<Star className="w-4 h-4" />}
        />
        <DashboardCard
          title="Séances complétées"
          value={stats?.weeklyWorkouts?.toString() || "0"}
          target="5"
          icon={<Dumbbell className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <DashboardCard
          title="Poids soulevé (semaine)"
          value={`${Math.round(stats?.weeklyWeight || 0)} kg`}
          target={`${Math.round((stats?.weeklyWeight || 0) * 1.1)} kg`}
          icon={<Dumbbell className="w-5 h-5" />}
        />
        <DashboardCard
          title="Poids soulevé (mois)"
          value={`${Math.round(stats?.monthlyWeight || 0)} kg`}
          target={`${Math.round((stats?.monthlyWeight || 0) * 1.1)} kg`}
          icon={<Activity className="w-5 h-5" />}
        />
        <DashboardCard
          title="Poids soulevé (année)"
          value={`${Math.round(stats?.yearlyWeight || 0)} kg`}
          target={`${Math.round((stats?.yearlyWeight || 0) * 1.1)} kg`}
          icon={<Heart className="w-5 h-5" />}
        />
      </div>

      <DetailedStats />
    </div>
  );
};