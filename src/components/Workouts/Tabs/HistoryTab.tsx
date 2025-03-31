
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function HistoryTab() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const { data: pastSessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['past-workout-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          program:program_id(name)
        `)
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error("Erreur lors de la récupération des sessions passées:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("workouts.workoutHistory")}</CardTitle>
      </CardHeader>
      <CardContent>
        {loadingSessions ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg animate-pulse">
                <div className="h-4 w-1/3 bg-muted rounded"></div>
                <div className="h-4 w-1/4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : pastSessions?.length === 0 ? (
          <div className="text-center py-6">
            <History className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
            <p className="text-muted-foreground">
              {t("workouts.noHistory")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastSessions?.map((session) => (
              <div 
                key={session.id}
                className="flex justify-between items-center p-3 bg-muted/20 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => navigate(`/workouts/summary/${session.id}`)}
              >
                <div>
                  <p className="font-medium">{session.program?.name || t("workouts.customWorkout")}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.created_at).toLocaleDateString()} • {session.total_duration_minutes} min
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-medium">{session.calories_burned} kcal</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => navigate('/workouts/history')}>
          {t("workouts.viewFullHistory")}
        </Button>
      </CardFooter>
    </Card>
  );
}
