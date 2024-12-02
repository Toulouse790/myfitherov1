import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";

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
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={isCompleted ? "default" : "outline"}
        size="sm"
        className="w-full min-h-[2.5rem] px-3"
        onClick={() => isNext && onComplete()}
        disabled={!isNext || restTimer !== null}
      >
        {isCompleted ? (
          <div className="flex items-center justify-center gap-2 w-full">
            <Check className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">Série {setIndex + 1} complétée</span>
          </div>
        ) : (
          <span className="text-sm">Série {setIndex + 1}</span>
        )}
      </Button>
      <div className="flex items-center gap-2 px-1">
        <span className="text-xs sm:text-sm text-muted-foreground">{reps} répétitions</span>
        {isNext && restTimer !== null && (
          <div className="flex items-center gap-1 text-primary ml-auto">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">{restTimer}s</span>
          </div>
        )}
      </div>
    </div>
  );
};