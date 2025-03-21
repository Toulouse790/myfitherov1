
import { Check, Timer } from "lucide-react";

interface SetStatusProps {
  isCompleted: boolean;
  isResting: boolean;
  restTime: number | null;
}

export const SetStatus = ({ isCompleted, isResting, restTime }: SetStatusProps) => {
  if (isCompleted) {
    return (
      <div className="flex items-center gap-1 text-primary">
        <Check className="h-4 w-4" />
        <span className="text-sm">Complétée</span>
      </div>
    );
  }

  if (isResting && restTime !== null) {
    return (
      <div className="flex items-center gap-1 text-amber-500 animate-pulse">
        <Timer className="h-4 w-4" />
        <span className="text-sm font-medium">{restTime}s repos</span>
      </div>
    );
  }

  return null;
};
