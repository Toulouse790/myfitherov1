import { Header } from "@/components/Layout/Header";
import { DashboardCard } from "@/components/Dashboard/DashboardCard";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";
import { Target, Dumbbell, Trophy, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
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

      return {
        trainingStats: trainingStats?.[0],
        profile
      };
    }
  });

  return (
    <Header>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground">
            Suivez vos progrès et atteignez vos objectifs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardCard
            title="Objectif du jour"
            value={`${stats?.trainingStats?.session_duration_minutes || 0} min`}
            target="45 min"
            icon={<Target className="w-4 h-4" />}
          />
          <DashboardCard
            title="Séances complétées"
            value="3"
            target="5"
            icon={<Dumbbell className="w-4 h-4" />}
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WorkoutSuggestions />
          <PersonalizedRecommendations />
        </div>
      </div>
    </Header>
  );
}