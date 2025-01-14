import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Index() {
  const navigate = useNavigate();

  const handleCreateSession = () => {
    navigate('/workouts/exercise/library');
  };

  const handleAIGeneration = () => {
    navigate('/workout-generate');
  };

  return (
    <Header>
      <div className="container mx-auto px-4 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Bienvenue sur votre espace d'entraînement</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Commencez une séance ou consultez vos statistiques
          </p>
        </div>

        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleCreateSession}
              className="flex-1 gap-2 h-16 text-lg"
              size="lg"
            >
              <Plus className="w-6 h-6" />
              Créer ma séance
            </Button>
            <Button 
              onClick={handleAIGeneration}
              variant="outline"
              className="flex-1 gap-2 h-16 text-lg"
              size="lg"
            >
              <Sparkles className="w-6 h-6" />
              Générer avec l'IA
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WorkoutSuggestions showAllSuggestions={false} />
          <PersonalizedRecommendations />
        </div>
      </div>
    </Header>
  );
}