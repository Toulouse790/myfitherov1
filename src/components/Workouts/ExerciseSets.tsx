import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RestTimer } from "./ExerciseSets/RestTimer";
import { SetButton } from "./ExerciseSets/SetButton";
import { SessionTimer } from "./ExerciseSets/SessionTimer";

interface ExerciseSetsProps {
  exercises: string[];
  onExerciseComplete?: (index: number) => void;
  currentExerciseIndex?: number;
  sessionId?: string | null;
}

export const ExerciseSets = ({ 
  exercises,
  onExerciseComplete,
  currentExerciseIndex = 0,
  sessionId
}: ExerciseSetsProps) => {
  const [completedSets, setCompletedSets] = useState<{ [key: string]: number }>({});
  const [weights, setWeights] = useState<{ [key: string]: number }>({});
  const [reps, setReps] = useState<{ [key: string]: number }>({});
  const [restTimers, setRestTimers] = useState<{ [key: string]: number | null }>({});
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [totalRestTime, setTotalRestTime] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initialWeights: { [key: string]: number } = {};
    const initialReps: { [key: string]: number } = {};
    exercises.forEach(exercise => {
      initialWeights[exercise] = 20;
      initialReps[exercise] = 12;
    });
    setWeights(initialWeights);
    setReps(initialReps);
  }, [exercises]);

  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    Object.entries(restTimers).forEach(([exerciseName, timer]) => {
      if (timer !== null && timer > 0) {
        intervals[exerciseName] = setInterval(() => {
          setRestTimers(prev => {
            const currentTimer = prev[exerciseName];
            if (currentTimer === null || currentTimer <= 1) {
              clearInterval(intervals[exerciseName]);
              toast({
                title: "Repos terminé !",
                description: "C'est reparti ! Commencez la série suivante.",
              });
              return { ...prev, [exerciseName]: null };
            }
            return { ...prev, [exerciseName]: currentTimer - 1 };
          });
          setTotalRestTime(prev => prev + 1);
        }, 1000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, [restTimers, toast]);

  const handleSetComplete = async (exerciseName: string) => {
    const currentSets = completedSets[exerciseName] || 0;
    
    if (currentSets < 3) {
      const newSetsCount = currentSets + 1;
      setCompletedSets(prev => ({
        ...prev,
        [exerciseName]: newSetsCount
      }));
      
      setRestTimers(prev => ({
        ...prev,
        [exerciseName]: 90
      }));

      // Save set data to database
      if (sessionId) {
        try {
          const { error } = await supabase
            .from('exercise_sets')
            .insert({
              session_id: sessionId,
              exercise_name: exerciseName,
              set_number: newSetsCount,
              reps: reps[exerciseName],
              weight: weights[exerciseName],
              rest_time_seconds: 90
            });

          if (error) throw error;

          // Update session stats
          await supabase
            .from('workout_sessions')
            .update({ 
              total_duration_minutes: Math.floor(sessionDuration / 60),
              total_rest_time_seconds: totalRestTime
            })
            .eq('id', sessionId);

        } catch (error) {
          console.error('Error saving set data:', error);
          toast({
            title: "Erreur",
            description: "Impossible de sauvegarder les données de la série",
            variant: "destructive",
          });
        }
      }

      const calories = Math.round(reps[exerciseName] * weights[exerciseName] * 0.15);
      toast({
        title: "Série complétée !",
        description: `${calories} calories brûlées. Repos de 90 secondes.`,
      });

      if (newSetsCount === 3) {
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
      <SessionTimer />

      {exercises.map((exerciseName) => (
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
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleWeightChange(exerciseName, weights[exerciseName] - 2.5)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={weights[exerciseName] || 0}
                      onChange={(e) => handleWeightChange(exerciseName, Number(e.target.value))}
                      className="text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleWeightChange(exerciseName, weights[exerciseName] + 2.5)}
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
                      onClick={() => handleRepsChange(exerciseName, reps[exerciseName] - 1)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={reps[exerciseName] || 0}
                      onChange={(e) => handleRepsChange(exerciseName, Number(e.target.value))}
                      className="text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRepsChange(exerciseName, reps[exerciseName] + 1)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <RestTimer restTimer={restTimers[exerciseName]} />
                
                <SetButton
                  isResting={restTimers[exerciseName] !== null}
                  currentSet={(completedSets[exerciseName] || 0) + 1}
                  maxSets={3}
                  onComplete={() => handleSetComplete(exerciseName)}
                  restTime={restTimers[exerciseName] || 0}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};