
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Dumbbell, Utensils, Moon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export const TodaySummary = () => {
  const { user } = useAuth();
  
  const { data, isLoading } = useQuery({
    queryKey: ['today-summary', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Get today's date in ISO format
      const today = new Date().toISOString().split('T')[0];
      
      // Get workouts for today
      const { data: workouts } = await supabase
        .from('workout_sessions')
        .select('id, name, total_duration_minutes')
        .eq('user_id', user.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);
      
      // Get nutrition data for today
      const { data: nutrition } = await supabase
        .from('food_journal')
        .select('calories')
        .eq('user_id', user.id)
        .gte('recorded_at', `${today}T00:00:00`)
        .lte('recorded_at', `${today}T23:59:59`);
      
      // Get sleep data for today
      const { data: sleep } = await supabase
        .from('sleep_records')
        .select('sleep_quality, sleep_duration_minutes')
        .eq('user_id', user.id)
        .gte('sleep_date', today)
        .lte('sleep_date', today);
      
      // Calculate totals
      const workoutMinutes = workouts?.reduce((total, w) => total + (w.total_duration_minutes || 0), 0) || 0;
      const calories = nutrition?.reduce((total, n) => total + (n.calories || 0), 0) || 0;
      const sleepQuality = sleep?.[0]?.sleep_quality || null;
      const sleepMinutes = sleep?.[0]?.sleep_duration_minutes || 0;
      
      return {
        workoutMinutes,
        calories,
        sleepQuality,
        sleepMinutes,
        hasWorkout: workouts && workouts.length > 0,
        hasNutrition: nutrition && nutrition.length > 0,
        hasSleep: sleep && sleep.length > 0
      };
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Résumé d'aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Résumé d'aujourd'hui</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Entraînement</span>
            </div>
            <span className="text-sm">{data?.workoutMinutes || 0} min</span>
          </div>
          <Progress 
            value={data?.workoutMinutes ? Math.min((data.workoutMinutes / 60) * 100, 100) : 0} 
            className="h-2" 
          />
          <p className="text-xs text-muted-foreground">
            {data?.hasWorkout 
              ? `${data.workoutMinutes} minutes d'entraînement aujourd'hui` 
              : "Pas encore d'entraînement aujourd'hui"}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Nutrition</span>
            </div>
            <span className="text-sm">{data?.calories || 0} cal</span>
          </div>
          <Progress 
            value={data?.calories ? Math.min((data.calories / 2000) * 100, 100) : 0} 
            className="h-2" 
          />
          <p className="text-xs text-muted-foreground">
            {data?.hasNutrition 
              ? `${data.calories} calories consommées sur 2000` 
              : "Pas encore de repas enregistré aujourd'hui"}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Sommeil</span>
            </div>
            <span className="text-sm">
              {data?.sleepMinutes ? `${Math.floor(data.sleepMinutes / 60)}h ${data.sleepMinutes % 60}m` : "N/A"}
            </span>
          </div>
          <Progress 
            value={data?.sleepMinutes ? Math.min((data.sleepMinutes / 480) * 100, 100) : 0} 
            className="h-2" 
          />
          <p className="text-xs text-muted-foreground">
            {data?.hasSleep 
              ? `Qualité: ${data.sleepQuality ? `${data.sleepQuality}/10` : "Non évaluée"}` 
              : "Pas de données de sommeil aujourd'hui"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
