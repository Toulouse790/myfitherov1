import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, RotateCcw, RefreshCw } from "lucide-react";

interface ExerciseAnimationProps {
  reps: number;
  restTime: number;
  sets: number;
  currentSet: number;
  isResting: boolean;
  progress: number;
}

export const ExerciseAnimation = ({
  reps,
  restTime,
  sets,
  currentSet,
  isResting,
  progress
}: ExerciseAnimationProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="relative">
          <RefreshCw 
            className={`w-8 h-8 text-primary ${!isResting ? 'animate-exercise-spin' : ''}`} 
          />
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {reps}
          </span>
        </div>
        <span className="text-sm font-medium">Répétitions</span>
      </Card>

      <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-secondary/10 to-secondary/5">
        <div className="relative">
          <Timer 
            className={`w-8 h-8 text-secondary ${isResting ? 'animate-exercise-pulse' : ''}`}
          />
          <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {restTime}s
          </span>
        </div>
        <span className="text-sm font-medium">Repos</span>
      </Card>

      <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-accent/10 to-accent/5">
        <div className="relative">
          <RotateCcw 
            className={`w-8 h-8 text-accent ${currentSet < sets ? 'hover:animate-exercise-bounce' : ''}`}
          />
          <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {currentSet}/{sets}
          </span>
        </div>
        <span className="text-sm font-medium">Séries</span>
      </Card>

      <div className="col-span-3">
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};