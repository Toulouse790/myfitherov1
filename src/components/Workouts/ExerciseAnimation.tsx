import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, RotateCcw, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExerciseAnimationProps {
  reps: number;
  restTime: number;
  sets: number;
  currentSet: number;
  isResting: boolean;
  progress: number;
  onSetComplete?: () => void;
}

export const ExerciseAnimation = ({
  reps,
  restTime,
  sets,
  currentSet,
  isResting,
  progress,
  onSetComplete
}: ExerciseAnimationProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center space-y-2">
          <div className="relative">
            <RefreshCw className="w-8 h-8 text-primary" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {reps}
            </span>
          </div>
          <span className="text-sm font-medium">Répétitions</span>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center space-y-2">
          <div className="relative">
            <Timer className="w-8 h-8 text-primary" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {restTime}s
            </span>
          </div>
          <span className="text-sm font-medium">Repos</span>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center space-y-2">
          <div className="relative">
            <RotateCcw className="w-8 h-8 text-primary" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {currentSet}/{sets}
            </span>
          </div>
          <span className="text-sm font-medium">Séries</span>
        </Card>
      </div>

      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        
        <Button 
          className="w-full h-12 text-lg"
          onClick={onSetComplete}
          disabled={isResting || currentSet > sets}
        >
          {isResting ? (
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              <span>Repos: {restTime}s</span>
            </div>
          ) : currentSet > sets ? (
            "Exercice terminé"
          ) : (
            "Valider la série"
          )}
        </Button>
      </div>
    </div>
  );
};