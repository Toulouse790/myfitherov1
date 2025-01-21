import { Header } from "@/components/Layout/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function DashboardStreaks() {
  const { user } = useAuth();

  const { data: streaks, isLoading } = useQuery({
    queryKey: ['user-streaks'],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id);
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
        <h1 className="text-3xl font-bold mb-8">Mes séries</h1>
        
        <div className="grid gap-6">
          {streaks?.map((streak) => (
            <Card key={streak.id} className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{streak.streak_type}</h3>
                  <p className="text-muted-foreground">
                    Série actuelle : {streak.current_streak} jours
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Record : {streak.longest_streak} jours
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Dernière activité : {new Date(streak.last_activity_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Header>
  );
}