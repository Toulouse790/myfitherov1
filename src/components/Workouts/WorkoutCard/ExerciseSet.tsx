
import { Button } from "@/components/ui/button";
import { Check, Timer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExerciseSetProps {
  setIndex: number;
  isCompleted: boolean;
  isNext: boolean;
  reps: number;
  restTimer: number | null;
  onComplete: () => void;
}

export const ExerciseSet = ({
  setIndex,
  isCompleted,
  isNext,
  reps,
  restTimer,
  onComplete,
}: ExerciseSetProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col gap-2 p-2 sm:p-3 bg-card rounded-lg border transition-all duration-300 hover:border-primary/50">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-medium">
          {t("workouts.set")} {setIndex + 1} - {reps} {t("workouts.reps")}
        </span>
        {restTimer !== null && isNext && (
          <div className="flex items-center gap-1 sm:gap-2 text-primary animate-pulse">
            <Timer className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">{restTimer}s</span>
          </div>
        )}
      </div>
      
      <Button
        variant={isCompleted ? "default" : "outline"}
        size="sm"
        className={`w-full text-xs sm:text-sm transition-all duration-300 ${
          isCompleted ? 'bg-primary hover:bg-primary/90' : ''
        }`}
        onClick={onComplete}
        disabled={!isNext || restTimer !== null}
      >
        {isCompleted ? (
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{t("workouts.setCompleted")}</span>
          </div>
        ) : (
          <span>{t("workouts.validateSet")}</span>
        )}
      </Button>
    </div>
  );
};
