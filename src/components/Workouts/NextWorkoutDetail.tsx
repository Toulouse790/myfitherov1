import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { SetManager } from "./ExerciseSets/SetManager";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { EndWorkoutButton } from "./NextWorkoutDetail/EndWorkoutButton";

export const NextWorkoutDetail = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const { exercises, currentExerciseIndex, workoutStarted, duration, handleConfirmEndWorkout } = useWorkoutSession();
  const { toast } = useToast();
  const [showSummary, setShowSummary] = useState(false);

  const currentExercise = currentExerciseIndex !== null ? exercises[currentExerciseIndex] : null;

  const handleSetComplete = () => {
    toast({
      title: "Série complétée !",
      description: "Prenez une pause de 90 secondes avant la prochaine série.",
    });
  };

  const handleEndWorkout = () => {
    setShowSummary(true);
  };

  const stats = {
    duration: Math.floor(duration / 60),
    totalWeight: 0, // À calculer en fonction des séries
    totalCalories: Math.round(duration / 60 * 7.5), // Estimation basique
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="p-6 space-y-6">
        {currentExercise ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{currentExercise}</h2>
              <div className="text-muted-foreground">
                <p>Séries totales : 3</p>
              </div>
            </div>
            
            <SetManager onSetComplete={handleSetComplete} />
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Aucun exercice sélectionné
          </p>
        )}
      </Card>

      <EndWorkoutButton 
        workoutStarted={workoutStarted}
        onEndWorkout={handleEndWorkout}
      />

      <WorkoutSummaryDialog
        open={showSummary}
        onOpenChange={setShowSummary}
        stats={stats}
        onConfirm={handleConfirmEndWorkout}
      />
    </div>
  );
};