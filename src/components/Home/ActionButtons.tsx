import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ChartBar, Activity, Utensils } from "lucide-react";
import { useHomeActions } from "@/hooks/use-home-actions";

export const ActionButtons = () => {
  const { 
    handleCreateSession, 
    handleAIGeneration, 
    handleStats, 
    handleTrainingSuggestions, 
    handleMealSuggestions,
    isLoading 
  } = useHomeActions();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Button 
        onClick={handleCreateSession}
        className="h-auto py-4 group hover:scale-[1.02] transition-all duration-300"
        variant="default"
        size="lg"
      >
        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
        Créer ma séance
      </Button>

      <Button 
        onClick={handleAIGeneration}
        variant="outline"
        className="h-auto py-4 hover:bg-primary/10 transition-all duration-300"
        size="lg"
        disabled={isLoading}
      >
        <Sparkles className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} />
        Laisse-moi faire
      </Button>

      <Button
        onClick={handleStats}
        variant="secondary"
        className="h-auto py-4 hover:bg-secondary/90 transition-all duration-300"
        size="lg"
      >
        <ChartBar className="w-5 h-5 mr-2" />
        Statistiques
      </Button>

      <Button
        onClick={handleTrainingSuggestions}
        variant="outline"
        className="h-auto py-4 hover:bg-primary/10 transition-all duration-300"
        size="lg"
      >
        <Activity className="w-5 h-5 mr-2" />
        Suggestions d'entraînement
      </Button>

      <Button
        onClick={handleMealSuggestions}
        variant="outline"
        className="h-auto py-4 hover:bg-primary/10 transition-all duration-300 sm:col-span-2 lg:col-span-1"
        size="lg"
      >
        <Utensils className="w-5 h-5 mr-2" />
        Suggestions de repas
      </Button>
    </div>
  );
};