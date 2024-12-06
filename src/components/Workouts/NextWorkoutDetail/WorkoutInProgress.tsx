import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useRestTimer } from "@/hooks/use-rest-timer";

interface WorkoutInProgressProps {
  exercises: string[];
  currentExerciseIndex: number | null;
  onExerciseClick: (index: number) => void;
  sessionId?: string | null;
  onRegenerateWorkout: () => void;
}

export const WorkoutInProgress = ({
  exercises,
  currentExerciseIndex,
  sessionId,
}: WorkoutInProgressProps) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(12);
  const { toast } = useToast();
  const { restTimers, startRestTimer } = useRestTimer();

  const currentExerciseId = currentExerciseIndex !== null ? exercises[currentExerciseIndex] : null;
  const currentRestTimer = currentExerciseId ? restTimers[currentExerciseId] : null;

  const handleSetComplete = () => {
    if (currentSet < 4 && currentExerciseId) {
      setCurrentSet(prev => prev + 1);
      startRestTimer(currentExerciseId);
      
      // Calculer les calories brûlées (exemple simple)
      const calories = Math.round(reps * weight * 0.15);
      
      toast({
        title: "Série complétée !",
        description: `${calories} calories brûlées. 90 secondes de repos.`,
      });
    } else {
      toast({
        title: "Exercice terminé !",
        description: "Passez à l'exercice suivant.",
      });
    }
  };

  if (!exercises[currentExerciseIndex!]) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card className="overflow-hidden">
        <div className="aspect-video bg-muted">
          <img
            src="/placeholder.svg"
            alt={exercises[currentExerciseIndex!]}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">{exercises[currentExerciseIndex!]}</h2>
            <p className="text-muted-foreground">
              Série {currentSet}/4 • {reps} répétitions
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Poids (kg)</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWeight(prev => Math.max(0, prev - 2.5))}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setWeight(prev => prev + 2.5)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Répétitions</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setReps(prev => Math.max(1, prev - 1))}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setReps(prev => prev + 1)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {currentRestTimer !== null ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-center gap-2 text-2xl font-bold text-primary"
              >
                <Timer className="h-6 w-6" />
                <span>{currentRestTimer}s</span>
              </motion.div>
            ) : (
              <Button
                className="w-full h-12 text-lg"
                onClick={handleSetComplete}
                disabled={currentRestTimer !== null}
              >
                {currentSet === 4 ? "Terminer l'exercice" : "Valider la série"}
              </Button>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};