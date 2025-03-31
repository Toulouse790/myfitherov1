
import { Button } from "@/components/ui/button";
import { Timer, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <Button
      onClick={onComplete}
      className={`w-full ${isMobile ? 'h-14 text-base' : 'h-12 text-lg'} transition-all`}
      disabled={isResting || (currentSet > maxSets && !isTransitioning)}
      size={isMobile ? "lg" : "default"}
      aria-label={isResting ? t("workouts.restingLabel") || "En repos" : t("workouts.validateSetLabel") || "Valider la série"}
    >
      {isResting ? (
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <span className="truncate">{t("workouts.rest") || "Repos"}: {restTime}s</span>
        </div>
      ) : isTransitioning ? (
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <span className="truncate">{t("workouts.preparingNextExercise") || "Préparation du prochain exercice"}</span>
        </div>
      ) : currentSet > maxSets ? (
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5" />
          <span className="truncate">{t("workouts.exerciseCompleted") || "Exercice terminé"}</span>
        </div>
      ) : (
        t("workouts.validateSet") || "Valider la série"
      )}
    </Button>
  );
};
