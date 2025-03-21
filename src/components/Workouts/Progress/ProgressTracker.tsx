
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart2, TrendingUp, Calendar, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const ProgressTracker = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week");
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['workout-stats', user?.id, selectedPeriod],
    queryFn: async () => {
      if (!user) return null;
      
      const today = new Date();
      let startDate;
      
      if (selectedPeriod === "week") {
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
      } else if (selectedPeriod === "month") {
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
      } else {
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
      }
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
        throw error;
      }
      
      return {
        sessions: data || [],
        totalWorkouts: data?.length || 0,
        totalDuration: data?.reduce((sum, s) => sum + (s.total_duration_minutes || 0), 0) || 0,
        totalCalories: data?.reduce((sum, s) => sum + (s.calories_burned || 0), 0) || 0,
        averageDuration: data?.length ? Math.round(data.reduce((sum, s) => sum + (s.total_duration_minutes || 0), 0) / data.length) : 0
      };
    },
    enabled: !!user
  });

  const { data: goals } = useQuery({
    queryKey: ['user-goals', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error("Erreur lors de la récupération des objectifs:", error);
        throw error;
      }
      
      return data || {
        weekly_workouts: 3,
        monthly_duration: 600, // 10 heures
        monthly_calories: 3000
      };
    },
    enabled: !!user
  });

  const calculateProgress = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suivi de progrès</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const workoutGoal = selectedPeriod === "week" 
    ? goals?.weekly_workouts || 3 
    : selectedPeriod === "month" 
      ? (goals?.weekly_workouts || 3) * 4 
      : (goals?.weekly_workouts || 3) * 52;
      
  const durationGoal = selectedPeriod === "week" 
    ? goals?.monthly_duration / 4 || 150 
    : selectedPeriod === "month" 
      ? goals?.monthly_duration || 600 
      : (goals?.monthly_duration || 600) * 12;
      
  const caloriesGoal = selectedPeriod === "week" 
    ? goals?.monthly_calories / 4 || 750 
    : selectedPeriod === "month" 
      ? goals?.monthly_calories || 3000 
      : (goals?.monthly_calories || 3000) * 12;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Suivi de progrès</CardTitle>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedPeriod("week")}
            className={`text-xs px-2 py-1 rounded-md ${
              selectedPeriod === "week" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`text-xs px-2 py-1 rounded-md ${
              selectedPeriod === "month" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => setSelectedPeriod("year")}
            className={`text-xs px-2 py-1 rounded-md ${
              selectedPeriod === "year" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            Année
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">Entraînements</span>
              </div>
              <span className="text-sm font-medium">
                {stats?.totalWorkouts || 0}/{workoutGoal}
              </span>
            </div>
            <Progress value={calculateProgress(stats?.totalWorkouts || 0, workoutGoal)} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">Minutes d'entraînement</span>
              </div>
              <span className="text-sm font-medium">
                {stats?.totalDuration || 0}/{durationGoal}
              </span>
            </div>
            <Progress value={calculateProgress(stats?.totalDuration || 0, durationGoal)} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">Calories brûlées</span>
              </div>
              <span className="text-sm font-medium">
                {stats?.totalCalories || 0}/{caloriesGoal}
              </span>
            </div>
            <Progress value={calculateProgress(stats?.totalCalories || 0, caloriesGoal)} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between pt-2 text-sm">
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-primary" />
              <span>Durée moyenne</span>
            </div>
            <span className="font-medium">{stats?.averageDuration || 0} min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
