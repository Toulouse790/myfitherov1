
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timer, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useRestTimer } from "@/hooks/use-rest-timer";
import { debugLogger } from "@/utils/debug-logger";

interface WorkoutInProgressProps {
  exercises: string[];
  currentExerciseIndex: number | null;
  onExerciseClick: (index: number) => void;
  sessionId?: string | null;
  onRegenerateWorkout: () => void;
  onExerciseComplete: (index: number, caloriesBurned: number, weightLifted: number) => void;
}

export const WorkoutInProgress = ({
  exercises,
  currentExerciseIndex,
  onExerciseComplete,
}: WorkoutInProgressProps) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState(20);
  const [reps, setReps] = useState(12);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [sets, setSets] = useState(4); // Total sets for the exercise
  const [completedSets, setCompletedSets] = useState(0);
  const { toast } = useToast();
  
  // Utilisation correcte du hook useRestTimer
  const { 
    duration: restTimer, 
    startTimer: startRestTimer,
    isActive: isResting
  } = useRestTimer({
    initialDuration: 90,
    onComplete: () => {
      toast({
        title: "Repos terminé !",
        description: "C'est reparti ! Commencez la série suivante.",
      });
    }
  });

  const currentExerciseName = currentExerciseIndex !== null ? exercises[currentExerciseIndex] : null;

  // Calcul amélioré des calories basé sur l'effort réel
  const calculateCalories = (reps: number, weight: number) => {
    // Formule: 0.05 calories par répétition par kilo soulevé * facteur d'intensité
    const intensityFactor = 1.2; // Intensité modérée
    const calories = Math.round(0.05 * reps * weight * intensityFactor);
    
    debugLogger.log("WorkoutInProgress", "Calcul des calories pour une série:", {
      reps,
      weight,
      intensityFactor,
      caloriesCalculated: calories
    });
    
    return calories;
  };

  const handleSetComplete = () => {
    if (currentSet <= sets && currentExerciseName) {
      // Calculer les calories pour cette série
      const setCalories = calculateCalories(reps, weight);
      const setWeight = reps * weight;
      
      // Mettre à jour les totaux
      setTotalCalories(prev => prev + setCalories);
      setTotalWeight(prev => prev + setWeight);
      setCompletedSets(prev => prev + 1);
      
      if (currentSet < sets) {
        setCurrentSet(prev => prev + 1);
        // Démarrer le timer de repos
        startRestTimer();
        
        toast({
          title: "Série complétée !",
          description: `${setCalories} calories brûlées. 90 secondes de repos.`,
        });
      } else {
        // Exercise completed
        toast({
          title: "Exercice terminé !",
          description: "Passez à l'exercice suivant.",
        });
        
        debugLogger.log("WorkoutInProgress", "Exercice terminé:", {
          exerciseName: currentExerciseName,
          totalSets: sets,
          totalCalories,
          totalWeight,
          completedSets: completedSets + 1
        });
        
        if (currentExerciseIndex !== null) {
          onExerciseComplete(currentExerciseIndex, totalCalories + setCalories, totalWeight + setWeight);
        }
        
        // Reset for next exercise
        setCurrentSet(1);
        setTotalCalories(0);
        setTotalWeight(0);
        setCompletedSets(0);
      }
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
              Série {currentSet}/{sets} • {reps} répétitions
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Calories accumulées: {totalCalories} • Poids total: {totalWeight}kg
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
            {restTimer !== null ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-center gap-2 text-2xl font-bold text-primary"
              >
                <Timer className="h-6 w-6" />
                <span>{restTimer}s</span>
              </motion.div>
            ) : (
              <Button
                className="w-full h-12 text-lg"
                onClick={handleSetComplete}
                disabled={isResting}
              >
                {currentSet === sets ? "Terminer l'exercice" : "Valider la série"}
              </Button>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};
