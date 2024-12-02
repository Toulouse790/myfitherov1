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
    <>
      <Button
        variant={isCompleted ? "default" : "outline"}
        size="sm"
        className="w-24"
        onClick={() => isNext && onComplete()}
        disabled={!isNext || restTimer !== null}
      >
        {isCompleted ? <Check className="h-4 w-4" /> : `Série ${setIndex + 1}`}
      </Button>
      <div className="flex items-center gap-2">
        <span className="text-sm">{reps} répétitions</span>
        {isNext && restTimer !== null && (
          <div className="flex items-center gap-2 text-primary">
            <Clock className="h-4 w-4" />
            <span>{restTimer}s</span>
          </div>
        )}
      </div>
    </>
  );
};