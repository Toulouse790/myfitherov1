import { Header } from "@/components/Layout/Header";
import { BottomNav } from "@/components/Layout/BottomNav";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { Plus, Brain, Activity, ChartBar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);

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
        {/* Actions principales */}
        <div className="flex flex-row flex-wrap gap-4 mb-8">
          <Button 
            variant="default" 
            size="lg" 
            className="flex-1 h-24 min-w-[200px] flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/workouts')}
          >
            <Plus className="w-6 h-6" />
            <span>Créer ma séance</span>
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg" 
            className="flex-1 h-24 min-w-[200px] flex flex-col items-center justify-center gap-2"
            onClick={handleStartCardio}
          >
            <Activity className="w-6 h-6" />
            <span>Séance cardio</span>
          </Button>

          <Button 
            variant="secondary" 
            size="lg" 
            className="flex-1 h-24 min-w-[200px] flex flex-col items-center justify-center gap-2"
            onClick={() => navigate('/stats')}
          >
            <ChartBar className="w-6 h-6" />
            <span>Statistiques</span>
          </Button>

          <Button 
            variant="secondary" 
            size="lg" 
            className="flex-1 h-24 min-w-[200px] flex flex-col items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10"
            onClick={() => setShowDialog(true)}
          >
            <Sparkles className="w-6 h-6" />
            <span>Laissez-moi faire</span>
          </Button>
        </div>

        {/* Statistiques et suggestions */}
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