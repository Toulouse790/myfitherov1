import { Header } from "@/components/Layout/Header";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Trophy } from "lucide-react";

export default function AchievementsHistory() {
  const { user } = useAuth();

  const { data: achievements, isLoading } = useQuery({
    queryKey: ['achievements-history'],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });
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
        <div className="flex items-center gap-4 mb-8">
          <Trophy className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Historique des succès</h1>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {achievements?.map((achievement) => (
            <Card key={achievement.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Débloqué le {new Date(achievement.unlocked_at).toLocaleDateString()}
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