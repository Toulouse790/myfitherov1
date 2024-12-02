import { Button } from "@/components/ui/button";
import { Check, Timer } from "lucide-react";

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
    <div className="flex flex-col gap-2 p-3 bg-background rounded-lg border">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Série {setIndex + 1} - {reps} répétitions
        </span>
        {restTimer !== null && isNext && (
          <div className="flex items-center gap-2 text-primary">
            <Timer className="h-4 w-4" />
            <span className="text-sm font-medium">{restTimer}s</span>
          </div>
        )}
      </div>
      
      <Button
        variant={isCompleted ? "default" : "outline"}
        size="sm"
        className="w-full"
        onClick={onComplete}
        disabled={!isNext || restTimer !== null}
      >
        {isCompleted ? (
          <div className="flex items-center justify-center gap-2">
            <Check className="h-4 w-4" />
            <span>Série complétée</span>
          </div>
        ) : (
          <span>Valider la série</span>
        )}
      </Button>
    </div>
  );
};