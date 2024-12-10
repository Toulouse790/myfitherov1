import { Button } from "@/components/ui/button";
import { Timer, Check } from "lucide-react";

interface ExerciseSetProps {
  setNumber: number;
  totalSets: number;
  isCompleted: boolean;
  restTimer: number | null;
  onComplete: () => void;
}

export const ExerciseSet = ({
  setNumber,
  totalSets,
  isCompleted,
  restTimer,
  onComplete
}: ExerciseSetProps) => {
  return (
    <div className="space-y-4">
      {restTimer !== null ? (
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary animate-pulse">
          <Timer className="h-6 w-6" />
          <span>{restTimer}s</span>
        </div>
      ) : (
        <Button
          onClick={onComplete}
          className="w-full h-12 text-lg"
          disabled={isCompleted || restTimer !== null}
        >
          {isCompleted ? (
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Série complétée</span>
            </div>
          ) : setNumber === totalSets ? (
            "Terminer l'exercice"
          ) : (
            "Valider la série"
          )}
        </Button>
      )}
    </div>
  );
};