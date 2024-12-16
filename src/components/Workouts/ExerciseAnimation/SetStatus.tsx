import { Timer, Check } from "lucide-react";

interface SetStatusProps {
  isCompleted: boolean;
  isResting: boolean;
  restTime?: number | null;
}

export const SetStatus = ({ isCompleted, isResting, restTime }: SetStatusProps) => {
  if (isCompleted) {
    return (
      <div className="flex items-center gap-2 text-green-500">
        <Check className="h-4 w-4" />
        <span>Complété</span>
      </div>
    );
  }

  if (isResting && restTime) {
    return (
      <div className="flex items-center gap-2 text-primary animate-pulse">
        <Timer className="h-4 w-4" />
        <span>{restTime}s</span>
      </div>
    );
  }

  return null;
};