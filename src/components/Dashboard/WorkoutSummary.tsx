import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Activity, Calendar, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const WorkoutSummary = () => {
  const { data: stats } = useQuery({
    queryKey: ['workout-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);
      
      if (error) throw error;
      
      const dailyStats = data[0] || {
        session_duration_minutes: 0,
        rest_time_seconds: 90
      };

      const weeklyStats = {
        workouts: data.length,
        totalDuration: data.reduce((acc, stat) => acc + (stat.session_duration_minutes || 0), 0),
        avgRestTime: Math.round(
          data.reduce((acc, stat) => acc + (stat.rest_time_seconds || 90), 0) / data.length
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
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily" className="text-xs sm:text-sm">
            <Activity className="w-4 h-4 mr-2" />
            Aujourd'hui
          </TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs sm:text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            Semaine
          </TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Mois
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {stats?.dailyStats.session_duration_minutes || 0} min
              </p>
              <p className="text-sm text-muted-foreground">Durée</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {Math.round((stats?.dailyStats.session_duration_minutes || 0) * 7.5)} kcal
              </p>
              <p className="text-sm text-muted-foreground">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {stats?.dailyStats.rest_time_seconds || 90}s
              </p>
              <p className="text-sm text-muted-foreground">Repos</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {stats?.weeklyStats.workouts || 0}
              </p>
              <p className="text-sm text-muted-foreground">Entraînements</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {stats?.weeklyStats.totalDuration || 0} min
              </p>
              <p className="text-sm text-muted-foreground">Durée totale</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {stats?.weeklyStats.avgRestTime || 90}s
              </p>
              <p className="text-sm text-muted-foreground">Repos moyen</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {stats?.monthlyStats.totalWorkouts || 0}
              </p>
              <p className="text-sm text-muted-foreground">Total séances</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {stats?.monthlyStats.progress || 0}%
              </p>
              <p className="text-sm text-muted-foreground">Progression</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {stats?.monthlyStats.streak || 0} jours
              </p>
              <p className="text-sm text-muted-foreground">Série active</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
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