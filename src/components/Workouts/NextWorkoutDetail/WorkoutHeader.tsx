import { Timer } from "lucide-react";

interface WorkoutHeaderProps {
  title: string;
  duration: number;
}

export const WorkoutHeader = ({ title, duration }: WorkoutHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Timer className="w-4 h-4" />
        <span>{duration} mins</span>
      </div>
    </div>
  );
};