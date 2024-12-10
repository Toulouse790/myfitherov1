import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, RotateCcw, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWorkoutData } from "@/hooks/workout/use-workout-data";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-6 flex flex-col items-center justify-center space-y-3 hover:shadow-lg transition-shadow">
          <div className="relative">
            <RefreshCw className="w-10 h-10 text-primary animate-exercise-spin" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {reps}
            </span>
          </div>
          <span className="text-sm font-medium">Répétitions</span>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center space-y-3 hover:shadow-lg transition-shadow">
          <div className="relative">
            <Timer className="w-10 h-10 text-primary animate-exercise-pulse" />
            <div className="flex items-center gap-2 mt-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 rounded-full"
                onClick={() => adjustRestTime(false)}
                disabled={isResting}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="text-lg font-bold min-w-[3ch] text-center">{restTime}s</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 rounded-full"
                onClick={() => adjustRestTime(true)}
                disabled={isResting}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <span className="text-sm font-medium">Repos</span>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center space-y-3 hover:shadow-lg transition-shadow">
          <div className="relative">
            <RotateCcw className="w-10 h-10 text-primary animate-exercise-bounce" />
            <div className="flex items-center gap-2 mt-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 rounded-full"
                onClick={() => adjustSets(false)}
                disabled={isResting || sets <= 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="text-lg font-bold">{currentSet}/{sets}</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 rounded-full"
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
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-muted" />
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={isResting ? 'rest' : 'active'}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              className="w-full h-16 text-xl font-bold shadow-lg hover:shadow-xl transition-all"
              onClick={handleSetComplete}
              disabled={isResting || currentSet > sets}
              variant={isResting ? "secondary" : "default"}
            >
              {isResting ? (
                <div className="flex items-center gap-3">
                  <Timer className="h-6 w-6 animate-exercise-pulse" />
                  <span>Repos: {remainingRestTime || restTime}s</span>
                </div>
              ) : currentSet > sets ? (
                "Exercice terminé"
              ) : (
                "Valider la série"
              )}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};