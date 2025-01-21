import { Header } from "@/components/Layout/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { BarChart } from "@/components/ui/chart";

export default function WeeklyReport() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['weekly-report'],
    queryFn: async () => {
      if (!user) return null;
      
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      
      const { data: workouts } = await supabase
        .from('training_stats')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startOfWeek.toISOString());

      return workouts;
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

  const chartData = stats?.map(stat => ({
    day: new Date(stat.created_at).toLocaleDateString('fr-FR', { weekday: 'short' }),
    minutes: stat.session_duration_minutes,
    calories: stat.calories_burned
  })) || [];

  return (
    <Header>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Rapport hebdomadaire</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Durée d'entraînement</h2>
            <BarChart
              data={chartData}
              index="day"
              categories={["minutes"]}
              colors={["#10B981"]}
              valueFormatter={(value: number) => `${value} min`}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Calories brûlées</h2>
            <BarChart
              data={chartData}
              index="day"
              categories={["calories"]}
              colors={["#EC4899"]}
              valueFormatter={(value: number) => `${value} kcal`}
            />
          </Card>
        </div>
      </div>
    </Header>
  );
}