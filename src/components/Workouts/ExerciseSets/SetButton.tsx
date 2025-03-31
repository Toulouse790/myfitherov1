
import { Button } from "@/components/ui/button";
import { Timer, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SetButtonProps {
  isResting: boolean;
  currentSet: number;
  maxSets: number;
  onComplete: () => void;
  restTime: number;
  isTransitioning?: boolean;
}

export const SetButton = ({
  isResting,
  currentSet,
  maxSets,
  onComplete,
  restTime,
  isTransitioning = false
}: SetButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <Button
      onClick={onComplete}
      className="w-full h-12 text-lg"
      disabled={isResting || (currentSet > maxSets && !isTransitioning)}
    >
      {isResting ? (
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <span>{t("workouts.rest") || "Repos"}: {restTime}s</span>
        </div>
      ) : isTransitioning ? (
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <span>{t("workouts.preparingNextExercise") || "Préparation du prochain exercice"}</span>
        </div>
      ) : currentSet > maxSets ? (
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          <span>{t("workouts.exerciseCompleted") || "Exercice terminé"}</span>
        </div>
      ) : (
        t("workouts.validateSet") || "Valider la série"
      )}
    </Button>
  );
};
