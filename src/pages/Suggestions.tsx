import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Suggestions() {
  const navigate = useNavigate();

  const handleCreateSession = () => {
    navigate('/workouts/exercise/library');
  };

  const handleLetMeDoIt = () => {
    navigate('/workouts');
  };

  return (
    <Header>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Suggestions d'entraînement</h1>
          <p className="text-sm text-muted-foreground">
            Découvrez des séances adaptées à vos objectifs
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleCreateSession}
              className="flex-1 gap-2"
              size="lg"
            >
              <Plus className="w-5 h-5" />
              Créer ma séance
            </Button>
            <Button 
              onClick={handleLetMeDoIt}
              variant="outline"
              className="flex-1 gap-2"
              size="lg"
            >
              <Play className="w-5 h-5" />
              Laisse-moi faire
            </Button>
          </div>

          <WorkoutSuggestions showAllSuggestions={true} />
        </div>
      </div>
    </Header>
  );
}