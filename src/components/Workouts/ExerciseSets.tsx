import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useExercises } from "@/hooks/use-exercises";
import { motion } from "framer-motion";

interface ExerciseSetsProps {
  exercises: string[];
}

export const ExerciseSets = ({ exercises: exerciseIds }: ExerciseSetsProps) => {
  const { exercises, isLoading } = useExercises(exerciseIds);
  const [completedSets, setCompletedSets] = useState<{ [key: string]: number }>({});
  const [weights, setWeights] = useState<{ [key: string]: number }>({});
  const [reps, setReps] = useState<{ [key: string]: number }>({});
  const [restTimers, setRestTimers] = useState<{ [key: string]: number | null }>({});

  useEffect(() => {
    // Initialiser les poids et répétitions pour chaque exercice
    const initialWeights: { [key: string]: number } = {};
    const initialReps: { [key: string]: number } = {};
    exercises.forEach(exercise => {
      initialWeights[exercise.id] = 10;
      initialReps[exercise.id] = 12;
    });
    setWeights(initialWeights);
    setReps(initialReps);
  }, [exercises]);

  useEffect(() => {
    // Gérer les timers de repos indépendamment de la pause de l'entraînement
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    Object.entries(restTimers).forEach(([exerciseId, timer]) => {
      if (timer !== null) {
        intervals[exerciseId] = setInterval(() => {
          setRestTimers(prev => {
            const currentTimer = prev[exerciseId];
            if (currentTimer === null || currentTimer <= 1) {
              clearInterval(intervals[exerciseId]);
              return { ...prev, [exerciseId]: null };
            }
            return { ...prev, [exerciseId]: currentTimer - 1 };
          });
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [restTimers]);

  const handleSetComplete = (exerciseId: string) => {
    const currentSets = completedSets[exerciseId] || 0;
    
    if (currentSets < 3) {
      setCompletedSets(prev => ({
        ...prev,
        [exerciseId]: (prev[exerciseId] || 0) + 1
      }));
      
      // Démarrer le timer de repos
      setRestTimers(prev => ({ ...prev, [exerciseId]: 90 }));
    }
  };

  const handleWeightChange = (exerciseId: string, value: number) => {
    setWeights(prev => ({ ...prev, [exerciseId]: value }));
  };

  const handleRepsChange = (exerciseId: string, value: number) => {
    setReps(prev => ({ ...prev, [exerciseId]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {exercises.map((exercise) => (
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">{exercise.name}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Poids (kg)</label>
                  <Input
                    type="number"
                    value={weights[exercise.id] || 0}
                    onChange={(e) => handleWeightChange(exercise.id, Number(e.target.value))}
                    min={0}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Répétitions</label>
                  <Input
                    type="number"
                    value={reps[exercise.id] || 0}
                    onChange={(e) => handleRepsChange(exercise.id, Number(e.target.value))}
                    min={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">
                    Série {(completedSets[exercise.id] || 0) + 1}/3
                  </h4>
                  {restTimers[exercise.id] !== null && restTimers[exercise.id] !== undefined && (
                    <div className="flex items-center gap-2 text-primary animate-pulse">
                      <Timer className="h-4 w-4" />
                      <span>{restTimers[exercise.id]}s</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleSetComplete(exercise.id)}
                  className="w-full"
                  disabled={
                    restTimers[exercise.id] !== null || 
                    (completedSets[exercise.id] || 0) >= 3
                  }
                >
                  {(completedSets[exercise.id] || 0) >= 3 
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