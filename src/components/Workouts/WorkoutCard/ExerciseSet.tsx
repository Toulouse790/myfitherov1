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
        className="w-full"
        onClick={() => isNext && onComplete()}
        disabled={!isNext || restTimer !== null}
      >
        {isCompleted ? (
          <div className="flex items-center justify-center gap-2">
            <Check className="h-4 w-4" />
            <span>Série {setIndex + 1} complétée</span>
          </div>
        ) : (
          `Série ${setIndex + 1}`
        )}
      </Button>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>{reps} répétitions</span>
        {isNext && restTimer !== null && (
          <div className="flex items-center gap-2 text-primary">
            <Clock className="h-4 w-4" />
            <span>{restTimer}s</span>
          </div>
        )}
      </div>
    </div>
  );
};