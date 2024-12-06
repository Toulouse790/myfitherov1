import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ExerciseSetsProps {
  exercises: string[];
  onExerciseComplete?: (index: number) => void;
  currentExerciseIndex?: number;
}

export const ExerciseSets = ({ 
  exercises: exerciseNames,
  onExerciseComplete,
  currentExerciseIndex = 0
}: ExerciseSetsProps) => {
  const [completedSets, setCompletedSets] = useState<{ [key: string]: number }>({});
  const [weights, setWeights] = useState<{ [key: string]: number }>({});
  const [reps, setReps] = useState<{ [key: string]: number }>({});
  const [restTimers, setRestTimers] = useState<{ [key: string]: number | null }>({});
  const { toast } = useToast();

  useEffect(() => {
    // Initialize weights and reps for each exercise
    const initialWeights: { [key: string]: number } = {};
    const initialReps: { [key: string]: number } = {};
    exerciseNames.forEach(exercise => {
      initialWeights[exercise] = 10;
      initialReps[exercise] = 12;
    });
    setWeights(initialWeights);
    setReps(initialReps);
  }, [exerciseNames]);

  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    Object.entries(restTimers).forEach(([exerciseName, timer]) => {
      if (timer !== null && timer > 0) {
        console.log(`Starting rest timer for ${exerciseName}: ${timer}s`);
        intervals[exerciseName] = setInterval(() => {
          setRestTimers(prev => {
            const currentTimer = prev[exerciseName];
            if (currentTimer === null || currentTimer <= 1) {
              console.log(`Rest timer completed for ${exerciseName}`);
              toast({
                title: "Repos terminé !",
                description: "C'est reparti ! Commencez la série suivante.",
              });
              return { ...prev, [exerciseName]: null };
            }
            return { ...prev, [exerciseName]: currentTimer - 1 };
          });
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, [restTimers, toast]);

  const handleSetComplete = (exerciseName: string) => {
    console.log(`Completing set for ${exerciseName}`);
    const currentSets = completedSets[exerciseName] || 0;
    
    if (currentSets < 3) {
      const newSetsCount = currentSets + 1;
      setCompletedSets(prev => ({
        ...prev,
        [exerciseName]: newSetsCount
      }));
      
      console.log(`Starting rest timer for ${exerciseName}`);
      setRestTimers(prev => ({ ...prev, [exerciseName]: 90 }));

      // Calculate calories (simple estimation)
      const calories = Math.round(reps[exerciseName] * weights[exerciseName] * 0.15);

      toast({
        title: "Série complétée !",
        description: `${calories} calories brûlées. Repos de 90 secondes.`,
      });

      if (newSetsCount === 3) {
        console.log(`Exercise ${exerciseName} completed`);
        toast({
          title: "Exercice terminé !",
          description: "Passez à l'exercice suivant.",
        });
        if (onExerciseComplete && currentExerciseIndex !== undefined) {
          onExerciseComplete(currentExerciseIndex);
        }
      }
    }
  };

  const handleWeightChange = (exerciseName: string, value: number) => {
    setWeights(prev => ({ ...prev, [exerciseName]: value }));
  };

  const handleRepsChange = (exerciseName: string, value: number) => {
    setReps(prev => ({ ...prev, [exerciseName]: value }));
  };

  return (
    <div className="space-y-6">
      {exerciseNames.map((exerciseName) => (
        <motion.div
          key={exerciseName}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">{exerciseName}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Poids (kg)</label>
                  <Input
                    type="number"
                    value={weights[exerciseName] || 0}
                    onChange={(e) => handleWeightChange(exerciseName, Number(e.target.value))}
                    min={0}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Répétitions</label>
                  <Input
                    type="number"
                    value={reps[exerciseName] || 0}
                    onChange={(e) => handleRepsChange(exerciseName, Number(e.target.value))}
                    min={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">
                    Série {(completedSets[exerciseName] || 0) + 1}/3
                  </h4>
                  {restTimers[exerciseName] !== null && (
                    <div className="flex items-center gap-2 text-primary">
                      <Timer className="h-4 w-4" />
                      <span className="animate-pulse">{restTimers[exerciseName]}s</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleSetComplete(exerciseName)}
                  className="w-full"
                  disabled={
                    restTimers[exerciseName] !== null || 
                    (completedSets[exerciseName] || 0) >= 3
                  }
                >
                  {(completedSets[exerciseName] || 0) >= 3 
                    ? "Exercice terminé" 
                    : "Valider la série"
                  }
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};