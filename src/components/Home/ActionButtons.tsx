
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useHomeActions } from "@/hooks/use-home-actions";
import { useLanguage } from "@/contexts/LanguageContext";

export function ActionButtons() {
  const navigate = useNavigate();
  const { handleCreateSession, handleAIGeneration, isLoading } = useHomeActions();
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
      <Button
        variant="default"
        className="w-full bg-primary/90 hover:bg-primary font-medium py-6"
        onClick={() => navigate('/workouts')}
        disabled={isLoading}
      >
        {t("workouts.startWorkout", { fallback: "Commencer l'entraînement" })}
      </Button>

      <Button
        variant="outline"
        className="w-full font-medium py-6 border-2"
        onClick={handleAIGeneration}
        disabled={isLoading}
      >
        {t("workouts.generateProgram", { fallback: "Générer un programme" })}
      </Button>
    </div>
  );
}
