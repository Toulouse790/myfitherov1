import { Timer } from "lucide-react";
import { formatWorkoutTime } from "@/utils/time";

interface WorkoutTimerProps {
  duration: number;
}

export const WorkoutTimer = ({ duration }: WorkoutTimerProps) => {
  return (
    <div className="flex items-center gap-2">
      <Timer className="h-5 w-5 text-primary" />
      <span className="font-mono text-lg">{formatWorkoutTime(Math.round(duration))}</span>
    </div>
  );
};