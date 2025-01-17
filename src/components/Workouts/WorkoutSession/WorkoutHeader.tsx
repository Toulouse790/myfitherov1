import { Timer, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { formatWorkoutTime } from "@/utils/time";

interface WorkoutHeaderProps {
  sessionDuration: number;
  estimatedCalories: number;
  progress: number;
}

export const WorkoutHeader = ({ 
  sessionDuration, 
  estimatedCalories, 
  progress 
}: WorkoutHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 p-4 border-b">
      <div className="container max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Timer className="h-6 w-6 text-primary" />
            <span className="text-xl font-mono">{formatWorkoutTime(sessionDuration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-medium">{estimatedCalories} kcal</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};