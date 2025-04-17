
import { Clock, Dumbbell, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WorkoutStatsProps {
  exerciseCount: number;
  totalCalories: number;
  restDuration: number;
  onRestDurationChange: (adjustment: number) => void;
}

export const WorkoutStats = ({
  exerciseCount,
  totalCalories,
  restDuration,
  onRestDurationChange,
}: WorkoutStatsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4">
      <div className="flex items-center gap-1 sm:gap-2">
        <Dumbbell className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        <span className="text-xs sm:text-sm">{exerciseCount} {t("workouts.exercises")}</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        <span className="text-xs sm:text-sm">{totalCalories} {t("workouts.kcal")}</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-5 w-5 sm:h-6 sm:w-6"
            onClick={() => onRestDurationChange(-15)}
            disabled={restDuration <= 45}
          >
            <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
          </Button>
          <span className="text-xs sm:text-sm min-w-[3rem] sm:min-w-[4rem] text-center">{restDuration}s {t("workouts.rest")}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-5 w-5 sm:h-6 sm:w-6"
            onClick={() => onRestDurationChange(15)}
            disabled={restDuration >= 180}
          >
            <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
