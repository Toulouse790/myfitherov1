
import { Header } from "@/components/Layout/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Target, Trophy, Calendar } from "lucide-react";
import { useWellnessScore } from "@/hooks/use-wellness-score";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function DashboardOverview() {
  const { user } = useAuth();
  const { data: wellnessScore, isLoading: isLoadingWellness } = useWellnessScore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-overview', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [streaks, goals, achievements] = await Promise.all([
        supabase.from('user_streaks').select('*').eq('user_id', user.id),
        supabase.from('periodic_goals').select('*').eq('user_id', user.id),
        supabase.from('achievements').select('*').eq('user_id', user.id)
      ]);

      return {
        streaks: streaks.data || [],
        goals: goals.data || [],
        achievements: achievements.data || [],
        wellnessScore: wellnessScore
      };
    },
    enabled: !!user && !!wellnessScore
  });

  if (isLoading || isLoadingWellness) {
    return (
      <Header>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Header>
    );
  }

  const weeklyGoals = stats?.goals.filter(goal => goal.period_type === 'weekly') || [];
  const monthlyGoals = stats?.goals.filter(goal => goal.period_type === 'monthly') || [];

  return (
    <Header>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Séries en cours</h2>
            <p>{stats?.streaks.length || 0} séries actives</p>
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Objectifs</h2>
              <Link to="/goals/weekly">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span className="hidden sm:inline">Voir tous</span>
                </Button>
              </Link>
            </div>
            {stats?.goals && stats.goals.length > 0 ? (
              <div className="space-y-3">
                {weeklyGoals.length > 0 && (
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-3 w-3" /> 
                      <span>Hebdomadaires: {weeklyGoals.length}</span>
                    </div>
                    {weeklyGoals.slice(0, 1).map(goal => (
                      <div key={goal.id} className="pl-4 mt-1">
                        <Progress 
                          value={(goal.current_value?.value / goal.target_value?.value) * 100} 
                          className="h-2 mt-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {monthlyGoals.length > 0 && (
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-3 w-3" /> 
                      <span>Mensuels: {monthlyGoals.length}</span>
                    </div>
                    {monthlyGoals.slice(0, 1).map(goal => (
                      <div key={goal.id} className="pl-4 mt-1">
                        <Progress 
                          value={(goal.current_value?.value / goal.target_value?.value) * 100} 
                          className="h-2 mt-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Aucun objectif défini</p>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Succès</h2>
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <p>{stats?.achievements.length || 0} succès débloqués</p>
          </Card>
        </div>
        
        <div className="mt-8">
          <DashboardStats />
        </div>
        
        <div className="mt-8">
          <TrendMetrics />
        </div>
      </div>
    </Header>
  );
}
