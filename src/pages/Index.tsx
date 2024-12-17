import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";
import { Plus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <Header>
      <div className="container mx-auto px-4 py-8 pb-20">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground">
            Suivez vos progrès et atteignez vos objectifs
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1 gap-2 bg-purple-500 hover:bg-purple-600"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Créer ma séance
              </Button>
              <Button 
                variant="outline"
                className="flex-1 gap-2"
                size="lg"
              >
                <Play className="w-5 h-5" />
                Laisse-moi faire
              </Button>
            </div>

            <WorkoutSuggestions />
          </div>
          
          <PersonalizedRecommendations />
        </div>
      </div>
    </Header>
  );
}