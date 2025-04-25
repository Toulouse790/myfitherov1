
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const TrendingStats = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleStatsClick = () => {
    navigate('/stats');
  };
  
  const { data, isLoading } = useQuery({
    queryKey: ['weekly-streak', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      // Get today's date in ISO format
      const today = new Date();
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);
      
      const todayStr = today.toISOString().split('T')[0];
      const last7DaysStr = last7Days.toISOString().split('T')[0];
      
      // Get workouts for the last 7 days
      const { data: workouts } = await supabase
        .from('workout_sessions')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', `${last7DaysStr}T00:00:00`)
        .lte('created_at', `${todayStr}T23:59:59`)
        .order('created_at', { ascending: false });
      
      // Get unique days with workouts
      const uniqueDays = new Set();
      workouts?.forEach(workout => {
        const day = workout.created_at.split('T')[0];
        uniqueDays.add(day);
      });
      
      return {
        streak: uniqueDays.size,
        workoutCount: workouts?.length || 0
      };
    },
    enabled: !!user
  });
  
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex flex-col items-center justify-center h-full p-4">
          <Skeleton className="h-16 w-16 rounded-full mb-4" />
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      onClick={handleStatsClick}
      className="w-full h-full p-4 sm:p-6 hover:bg-accent transition-colors cursor-pointer border-2 border-transparent hover:border-primary/20 flex flex-col items-center justify-center"
      data-testid="stats-button"
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
        <ChartBar className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
      </div>
      
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-semibold">{t('dashboard.statistics')}</h3>
        {data && (
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium">{data.streak}/7 {t('common.days')}</p>
            <p className="text-xs text-muted-foreground">
              {data.workoutCount} {t('workouts.workoutsThisWeek')}
            </p>
          </div>
        )}
        {!data && (
          <p className="text-xs sm:text-sm text-center text-muted-foreground mt-1 sm:mt-2">
            {t('dashboard.checkProgress')}
          </p>
        )}
      </div>
    </Card>
  );
};
