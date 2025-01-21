import { Header } from "@/components/Layout/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function WeeklyGoals() {
  const { user } = useAuth();

  const { data: goals, isLoading } = useQuery({
    queryKey: ['weekly-goals'],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('periodic_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('period_type', 'weekly');
      return data;
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
        <h1 className="text-3xl font-bold mb-8">Objectifs hebdomadaires</h1>
        
        <div className="grid gap-6">
          {goals?.map((goal) => (
            <Card key={goal.id} className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{goal.goal_type}</h3>
                  <span className="text-sm text-muted-foreground">
                    {new Date(goal.start_date).toLocaleDateString()} - {new Date(goal.end_date).toLocaleDateString()}
                  </span>
                </div>
                
                <Progress 
                  value={
                    (goal.current_value?.value / goal.target_value?.value) * 100
                  } 
                />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Actuel: {goal.current_value?.value}</span>
                  <span>Objectif: {goal.target_value?.value}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Header>
  );
}