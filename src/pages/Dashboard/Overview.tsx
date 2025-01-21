import { Header } from "@/components/Layout/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function DashboardOverview() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
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
        achievements: achievements.data || []
      };
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <Header>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </Header>
    );
  }

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
            <h2 className="text-xl font-semibold mb-4">Objectifs</h2>
            <p>{stats?.goals.length || 0} objectifs en cours</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Succès</h2>
            <p>{stats?.achievements.length || 0} succès débloqués</p>
          </Card>
        </div>
      </div>
    </Header>
  );
}