import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Activity, Brain, ChartBar, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  points: number;
  level: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  const handleStartCardio = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour démarrer une séance",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            user_id: user.id,
            type: 'cardio',
            status: 'in_progress',
            exercises: []
          }
        ])
        .select()
        .single();

      if (error) throw error;

      navigate(`/workouts/exercise/next-workout?session=${session.id}`);
    } catch (error) {
      console.error('Error starting cardio session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la séance de cardio",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 pt-8 pb-24">
        {/* Niveau et Points */}
        <Card className="p-4 bg-primary/5 mb-8">
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

        {/* Actions principales */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/workouts')}
          >
            <Plus className="w-6 h-6" />
            <span>Créer ma séance</span>
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full h-24 flex flex-col items-center justify-center gap-2"
            onClick={handleStartCardio}
          >
            <Activity className="w-6 h-6" />
            <span>Séance cardio</span>
          </Button>

          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full h-24 flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/stats')}
          >
            <ChartBar className="w-6 h-6" />
            <span>Statistiques</span>
          </Button>

          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10"
            onClick={() => setShowDialog(true)}
          >
            <Brain className="w-6 h-6" />
            <span>IA Coach</span>
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="space-y-6">
          <DashboardStats />
          <WorkoutSuggestions />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;