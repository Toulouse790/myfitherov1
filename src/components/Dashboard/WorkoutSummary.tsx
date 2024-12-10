import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const WorkoutSummary = () => {
  const { data: stats } = useQuery({
    queryKey: ['workout-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          training_stats (*)
        `)
        .order('created_at', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      
      const dailyStats = data[0] || {
        total_duration_minutes: 0,
        total_rest_time_seconds: 90
      };

      const weeklyStats = {
        workouts: data.length,
        totalDuration: data.reduce((acc, stat) => acc + (stat.total_duration_minutes || 0), 0),
        avgRestTime: Math.round(
          data.reduce((acc, stat) => acc + (stat.total_rest_time_seconds || 90), 0) / data.length
        )
      };

      const monthlyStats = {
        totalWorkouts: data.length,
        progress: Math.min(Math.round((data.length / 20) * 100), 100),
        streak: calculateStreak(data)
      };

      return {
        dailyStats,
        weeklyStats,
        monthlyStats
      };
    }
  });

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold">Résumé des entraînements</h2>
      <div className="mt-4">
        <h3 className="text-md font-medium">Statistiques quotidiennes</h3>
        <p>Durée totale: {stats?.dailyStats.total_duration_minutes} minutes</p>
        <p>Temps de repos total: {stats?.dailyStats.total_rest_time_seconds} secondes</p>
      </div>
      <div className="mt-4">
        <h3 className="text-md font-medium">Statistiques hebdomadaires</h3>
        <p>Nombre d'entraînements: {stats?.weeklyStats.workouts}</p>
        <p>Durée totale: {stats?.weeklyStats.totalDuration} minutes</p>
        <p>Temps de repos moyen: {stats?.weeklyStats.avgRestTime} secondes</p>
      </div>
      <div className="mt-4">
        <h3 className="text-md font-medium">Statistiques mensuelles</h3>
        <p>Nombre total d'entraînements: {stats?.monthlyStats.totalWorkouts}</p>
        <p>Progression: {stats?.monthlyStats.progress}%</p>
        <p>Série active: {stats?.monthlyStats.streak} jours</p>
      </div>
    </Card>
  );
};

function calculateStreak(data: any[]): number {
  if (!data.length) return 0;
  
  let streak = 1;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const hasWorkoutToday = data.some(stat => 
    new Date(stat.created_at).toDateString() === today.toDateString()
  );
  
  const hasWorkoutYesterday = data.some(stat => 
    new Date(stat.created_at).toDateString() === yesterday.toDateString()
  );
  
  if (!hasWorkoutToday && !hasWorkoutYesterday) return 0;
  
  for (let i = 1; i < data.length; i++) {
    const current = new Date(data[i].created_at);
    const prev = new Date(data[i - 1].created_at);
    
    const diffDays = Math.floor((prev.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
