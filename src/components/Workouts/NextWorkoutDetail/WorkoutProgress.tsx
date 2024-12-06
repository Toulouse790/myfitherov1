import { Progress } from "@/components/ui/progress";
import { Timer } from "lucide-react";
import { formatWorkoutTime } from "@/utils/time";
import { Button } from "@/components/ui/button";

interface WorkoutProgressProps {
  duration: number;
  progress: number;
  workoutStarted: boolean;
  onStartWorkout: () => void;
}

export const WorkoutProgress = ({
  duration,
  progress,
  workoutStarted,
  onStartWorkout
}: WorkoutProgressProps) => {
  return (
    <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 py-6 border-b">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Timer className="w-6 h-6 text-primary" />
          <span className="font-mono text-xl">
            {formatWorkoutTime(Math.round(duration))}
          </span>
        </div>
        
        {!workoutStarted && (
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8"
            onClick={onStartWorkout}
          >
            Commencer ma séance
          </Button>
        )}
      </div>

      {workoutStarted && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progression de la séance</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
};