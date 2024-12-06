import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { StrengthScore } from "@/components/Dashboard/StrengthScore";
import { TrendMetrics } from "@/components/Dashboard/TrendMetrics";
import { WorkoutSummary } from "@/components/Dashboard/WorkoutSummary";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Profile {
  id: string;
  points: number;
  level: number;
}

interface Measurement {
  [key: string]: number | null;
  measurement_date: number;
}

const Index = () => {
  const { data: profile } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: measurements } = useQuery<Measurement[]>({
    queryKey: ['measurements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('muscle_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) throw error;
      return data;
    }
  });

  const getProgressPercentage = (current: number, previous: number, target: number) => {
    if (!previous) return 0;
    const progress = ((current - previous) / (target - previous)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 pt-8 pb-24">
        {/* Niveau et Points */}
        <div className="mb-8">
          <Card className="p-4 bg-primary/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Niveau {profile?.level || 1}</h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {profile?.points || 0} points
              </span>
            </div>
            <Progress 
              value={((profile?.points || 0) % 1000) / 10} 
              className="h-2" 
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                Prochain niveau dans {1000 - ((profile?.points || 0) % 1000)} points
              </span>
            </div>
          </Card>
        </div>

        {/* Statistiques principales */}
        <div className="space-y-6">
          <DashboardStats />
          
          <div className="grid md:grid-cols-2 gap-4">
            <StrengthScore />
            <TrendMetrics />
          </div>

          {measurements && measurements.length >= 2 && (
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Évolution des mesures</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(measurements[0])
                  .filter(([key]) => key.endsWith('_cm'))
                  .map(([key, value]) => {
                    const previous = measurements[1][key];
                    if (!value || !previous) return null;
                    const target = previous * 1.1; // 10% d'augmentation comme objectif
                    const progress = getProgressPercentage(value as number, previous as number, target);
                    
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">
                            {key.replace('_cm', '').split('_').join(' ')}
                          </span>
                          <span className="text-sm font-medium">
                            {value} cm
                          </span>
                        </div>
                        <Progress value={progress} className="h-1.5" />
                      </div>
                    );
                  })}
              </div>
            </Card>
          )}

          <WorkoutSummary />
          <WorkoutSuggestions />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;