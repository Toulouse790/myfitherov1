import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, RotateCcw, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWorkoutData } from "@/hooks/workout/use-workout-data";

interface ExerciseAnimationProps {
  reps: number;
  restTime: number;
  sets: number;
  currentSet: number;
  isResting: boolean;
  progress: number;
  sessionId?: string | null;
  weight?: number;
  onSetComplete?: () => void;
  onSetsChange?: (newSets: number) => void;
  onRestTimeChange?: (newTime: number) => void;
}

export const ExerciseAnimation = ({
  reps,
  restTime,
  sets,
  currentSet,
  isResting,
  progress,
  sessionId,
  weight = 0,
  onSetComplete,
  onSetsChange,
  onRestTimeChange
}: ExerciseAnimationProps) => {
  const [remainingRestTime, setRemainingRestTime] = useState<number | null>(null);
  const { toast } = useToast();
  const { updateStats } = useWorkoutData(sessionId);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && remainingRestTime !== null && remainingRestTime > 0) {
      interval = setInterval(() => {
        setRemainingRestTime(prev => {
          if (prev === null || prev <= 1) {
            toast({
              title: "Repos terminé !",
              description: "C'est reparti ! Commencez la série suivante.",
            });
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, remainingRestTime, toast]);

  const handleSetComplete = async () => {
    if (onSetComplete) {
      // Update stats before completing the set
      await updateStats(weight, reps);
      onSetComplete();
      setRemainingRestTime(restTime);
    }
  };

  const adjustSets = (increment: boolean) => {
    if (onSetsChange) {
      const newSets = increment ? sets + 1 : Math.max(1, sets - 1);
      onSetsChange(newSets);
    }
  };

  const adjustRestTime = (increment: boolean) => {
    if (onRestTimeChange) {
      const newTime = increment ? restTime + 15 : Math.max(15, restTime - 15);
      onRestTimeChange(newTime);
    }
  };

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
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => adjustRestTime(false)}
                disabled={isResting}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="text-sm">{restTime}s</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => adjustRestTime(true)}
                disabled={isResting}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <span className="text-sm font-medium">Repos</span>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center space-y-2">
          <div className="relative">
            <RotateCcw className="w-8 h-8 text-primary" />
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => adjustSets(false)}
                disabled={isResting || sets <= 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="text-sm">{currentSet}/{sets}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => adjustSets(true)}
                disabled={isResting}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <span className="text-sm font-medium">Séries</span>
        </Card>
      </div>

      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        
        <Button 
          className="w-full h-12 text-lg"
          onClick={handleSetComplete}
          disabled={isResting || currentSet > sets}
        >
          {isResting ? (
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              <span>Repos: {remainingRestTime || restTime}s</span>
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