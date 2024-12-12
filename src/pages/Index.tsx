import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { Button } from "@/components/ui/button";
import { FilePlus, Activity, ChartBar, Shuffle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <Header>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            className="w-full flex items-center gap-2 h-auto py-4"
            onClick={() => navigate('/workouts')}
          >
            <FilePlus className="w-5 h-5" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">Créer ma séance</span>
              <span className="text-xs text-muted-foreground">Personnalisez votre entraînement</span>
            </div>
          </Button>

          <Button 
            variant="secondary"
            className="w-full flex items-center gap-2 h-auto py-4"
            onClick={() => navigate('/cardio')}
          >
            <Activity className="w-5 h-5" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">Cardio</span>
              <span className="text-xs text-muted-foreground">Entraînement cardio-vasculaire</span>
            </div>
          </Button>

          <Button 
            variant="secondary"
            className="w-full flex items-center gap-2 h-auto py-4"
            onClick={() => navigate('/stats')}
          >
            <ChartBar className="w-5 h-5" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">Statistiques</span>
              <span className="text-xs text-muted-foreground">Suivez vos progrès</span>
            </div>
          </Button>

          <Button 
            variant="secondary"
            className="w-full flex items-center gap-2 h-auto py-4"
            onClick={() => navigate('/workout/generate')}
          >
            <Shuffle className="w-5 h-5" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">Laisser moi faire</span>
              <span className="text-xs text-muted-foreground">Séance générée automatiquement</span>
            </div>
          </Button>
        </div>
        
        <div className="space-y-6">
          <WorkoutSuggestions />
        </div>
      </div>
    </Header>
  );
}