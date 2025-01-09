import { formatWorkoutTime } from "@/utils/time";
import { Timer } from "lucide-react";

interface WorkoutHeaderProps {
  sessionDuration: number;
}

export const WorkoutHeader = ({ sessionDuration }: WorkoutHeaderProps) => {
  return (
    <div className="flex items-center justify-between bg-card p-4 rounded-lg shadow">
      <div className="flex items-center gap-2">
        <Timer className="h-5 w-5 text-primary" />
        <span className="font-mono text-xl">
          {formatWorkoutTime(sessionDuration)}
        </span>
      </div>
    </div>
  );
};