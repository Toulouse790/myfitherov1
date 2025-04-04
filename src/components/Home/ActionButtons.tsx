
import { Activity, Dumbbell, Plus, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHomeActions } from "@/hooks/use-home-actions";

export const ActionButtons = () => {
  const { 
    handleCreateSession, 
    handleAIGeneration, 
    handleMealSuggestions,
    isLoading 
  } = useHomeActions();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Actions rapides</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Button 
          onClick={handleCreateSession}
          className="h-auto py-3 px-4 flex flex-col items-center justify-center text-center group hover:scale-[1.02] transition-all duration-300"
          variant="default"
          size="lg"
        >
          <Dumbbell className="w-6 h-6 mb-2" />
          <span className="text-sm">Démarrer un entraînement</span>
        </Button>

        <Button 
          onClick={handleMealSuggestions}
          variant="outline"
          className="h-auto py-3 px-4 flex flex-col items-center justify-center text-center hover:bg-primary/10 transition-all duration-300"
          size="lg"
        >
          <Utensils className="w-6 h-6 mb-2" />
          <span className="text-sm">Enregistrer un repas</span>
        </Button>

        <Button
          onClick={handleAIGeneration}
          variant="secondary"
          className="h-auto py-3 px-4 flex flex-col items-center justify-center text-center hover:bg-secondary/90 transition-all duration-300"
          size="lg"
          disabled={isLoading}
        >
          <Plus className="w-6 h-6 mb-2" />
          <span className="text-sm">Générer avec l'IA</span>
        </Button>
      </div>
    </div>
  );
};
