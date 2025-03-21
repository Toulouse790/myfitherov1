
import { Button } from "@/components/ui/button";
import { ArrowLeft, Timer } from "lucide-react";
import { NavigateFunction } from "react-router-dom";

interface WorkoutHeaderProps {
  navigate: NavigateFunction;
  sessionTime: number;
  formatTime: (seconds: number) => string;
}

export const WorkoutHeader = ({ navigate, sessionTime, formatTime }: WorkoutHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={() => navigate('/workouts')}>
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2">
        <Timer className="h-5 w-5 text-primary" />
        <span className="font-mono">{formatTime(sessionTime)}</span>
      </div>
    </div>
  );
};
