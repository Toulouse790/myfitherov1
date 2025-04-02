
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
      className={`w-full ${isMobile ? 'h-14 text-sm' : 'h-12 text-base'} transition-all`}
      disabled={isResting || (currentSet > maxSets && !isTransitioning)}
      size={isMobile ? "lg" : "default"}
      aria-label={isResting ? t("workouts.restingLabel") : t("workouts.validateSetLabel")}
    >
      {isResting ? (
        <div className="flex items-center gap-2 truncate">
          <Timer className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{t("workouts.rest")}: {restTime}s</span>
        </div>
      ) : isTransitioning ? (
        <div className="flex items-center gap-2 truncate">
          <Timer className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{t("workouts.preparingNextExercise")}</span>
        </div>
      ) : currentSet > maxSets ? (
        <div className="flex items-center gap-2 truncate">
          <Check className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{t("workouts.exerciseCompleted")}</span>
        </div>
      ) : (
        <span className="truncate">{t("workouts.validateSet")}</span>
      )}
    </Button>
  );
};
