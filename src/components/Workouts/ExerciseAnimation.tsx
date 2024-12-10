import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, Check, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWorkoutData } from "@/hooks/workout/use-workout-data";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

interface ExerciseAnimationProps {
  reps: number;
  restTime: number;
  sets: number;
  currentSet: number;
  isResting: boolean;
  progress: number;
  sessionId?: string | null;
  weight?: number;
  exerciseName: string;
  onSetComplete?: () => void;
  onSetsChange?: (newSets: number) => void;
  onRestTimeChange?: (newTime: number) => void;
}

export const ExerciseAnimation = ({
  reps: initialReps,
  restTime,
  sets,
  currentSet,
  isResting,
  progress,
  sessionId,
  weight: initialWeight = 0,
  exerciseName,
  onSetComplete,
  onRestTimeChange,
  onSetsChange
}: ExerciseAnimationProps) => {
  const [remainingRestTime, setRemainingRestTime] = useState<number | null>(null);
  const [currentReps, setCurrentReps] = useState(initialReps);
  const [currentWeight, setCurrentWeight] = useState(initialWeight);
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
      await updateStats(currentWeight, currentReps, exerciseName);
      onSetComplete();
      setRemainingRestTime(restTime);
    }
  };

  const handleAddSet = () => {
    if (onSetsChange) {
      onSetsChange(sets + 1);
      toast({
        title: "Série ajoutée",
        description: `Une nouvelle série a été ajoutée à ${exerciseName}`,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{exerciseName}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddSet}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une série
          </Button>
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: sets }).map((_, index) => (
            <Card 
              key={index} 
              className={`p-4 ${index + 1 === currentSet ? 'border-primary' : ''}`}
            >
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  className="w-12 h-12 rounded-full"
                  onClick={handleSetComplete}
                  disabled={index + 1 !== currentSet || isResting}
                >
                  <Check className="h-6 w-6" />
                </Button>

                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Répétitions</label>
                    <Input
                      type="number"
                      value={currentReps}
                      onChange={(e) => setCurrentReps(Number(e.target.value))}
                      className="text-center"
                      disabled={index + 1 !== currentSet || isResting}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Charge (kg)</label>
                    <Input
                      type="number"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(Number(e.target.value))}
                      className="text-center"
                      disabled={index + 1 !== currentSet || isResting}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
        
        <AnimatePresence mode="wait">
          {isResting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed bottom-20 right-4 left-4 bg-card p-4 rounded-lg shadow-lg border"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                  <Timer className="h-6 w-6 text-primary" />
                  <span>{remainingRestTime || restTime}s</span>
                </div>
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRestTimeChange?.(Math.max(15, restTime - 15))}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium min-w-[3ch] text-center">
                    {restTime}s
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onRestTimeChange?.(restTime + 15)}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};