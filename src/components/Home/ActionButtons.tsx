
import { Activity, Dumbbell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHomeActions } from "@/hooks/use-home-actions";
import { useLanguage } from "@/contexts/LanguageContext";

export const ActionButtons = () => {
  const { 
    handleCreateSession, 
    handleAIGeneration,
    isLoading 
  } = useHomeActions();
  
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Actions rapides</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={handleCreateSession}
          className="h-auto py-3 px-4 flex flex-col items-center justify-center text-center group hover:scale-[1.02] transition-all duration-300"
          variant="default"
          size="lg"
        >
          <Dumbbell className="w-6 h-6 mb-2" />
          <span className="text-sm">{t("workouts.startWorkout")}</span>
        </Button>

        <Button
          onClick={handleAIGeneration}
          variant="secondary"
          className="h-auto py-3 px-4 flex flex-col items-center justify-center text-center hover:bg-secondary/90 transition-all duration-300"
          size="lg"
          disabled={isLoading}
        >
          <Plus className="w-6 h-6 mb-2" />
          <span className="text-sm">{t("workouts.generateWorkoutTitle")}</span>
        </Button>
      </div>
    </div>
  );
};
