import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";

export default function Index() {
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
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground">
            Suivez vos progrès et atteignez vos objectifs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

            <WorkoutSuggestions showAllSuggestions={false} />
          </div>
          
          <PersonalizedRecommendations />
        </div>
      </div>
    </Header>
  );
}