import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useState } from "react";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { EndWorkoutButton } from "./NextWorkoutDetail/EndWorkoutButton";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ExerciseAnimation } from "./ExerciseAnimation";
import { Progress } from "@/components/ui/progress";

export const NextWorkoutDetail = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const { exercises, currentExerciseIndex, workoutStarted, duration, handleConfirmEndWorkout } = useWorkoutSession();
  const { toast } = useToast();
  const [showSummary, setShowSummary] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(90);

  const handleEndWorkout = () => {
    setShowSummary(true);
  };

  const handleConfirm = (difficulty: string, duration: number, muscleGroups: string[]) => {
    handleConfirmEndWorkout(difficulty, duration, muscleGroups);
  };

  const handleSetComplete = () => {
    if (currentSet < 3) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
    } else {
      setCurrentSet(1);
      setIsResting(false);
      if (currentExerciseIndex !== null && currentExerciseIndex < exercises.length - 1) {
        toast({
          title: "Exercice terminé !",
          description: "Passez à l'exercice suivant.",
        });
      }
    }
  };

  const handleRestTimeChange = (newTime: number) => {
    setRestTime(newTime);
  };

  const handleSetsChange = (newSets: number) => {
    // Cette fonction pourrait être utilisée pour ajuster le nombre total de séries
    console.log("Nouveau nombre de séries:", newSets);
  };

  const progress = currentExerciseIndex !== null 
    ? ((currentExerciseIndex + (currentSet - 1) / 3) / exercises.length) * 100
    : 0;

  if (!sessionId) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Démarrer un test</h2>
            <p className="text-muted-foreground">
              Cliquez sur le bouton ci-dessous pour commencer une session de test
            </p>
            <Button 
              onClick={() => {/* ... keep existing code */}}
              size="lg"
              className="w-full sm:w-auto"
            >
              <Timer className="w-5 h-5 mr-2" />
              Commencer le test
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentExercise = currentExerciseIndex !== null ? exercises[currentExerciseIndex] : null;

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {currentExercise || "Sélectionnez un exercice"}
            </h2>
            <span className="text-muted-foreground">
              {currentExerciseIndex !== null ? `${currentExerciseIndex + 1}/${exercises.length}` : ""}
            </span>
          </div>

          {currentExercise && (
            <ExerciseAnimation
              reps={12}
              restTime={restTime}
              sets={3}
              currentSet={currentSet}
              isResting={isResting}
              progress={progress}
              sessionId={sessionId}
              onSetComplete={handleSetComplete}
              onSetsChange={handleSetsChange}
              onRestTimeChange={handleRestTimeChange}
            />
          )}

          <div className="flex gap-4 mt-4">
            {exercises.map((exercise, index) => (
              <Button
                key={index}
                variant={currentExerciseIndex === index ? "default" : "outline"}
                onClick={() => {
                  if (currentExerciseIndex !== index) {
                    setCurrentSet(1);
                    setIsResting(false);
                  }
                }}
                className="flex-1"
              >
                {exercise}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <EndWorkoutButton 
        workoutStarted={workoutStarted}
        onEndWorkout={handleEndWorkout}
      />

      <WorkoutSummaryDialog
        open={showSummary}
        onOpenChange={setShowSummary}
        stats={{
          duration: Math.floor(duration / 60),
          totalWeight: 0,
          totalCalories: Math.round(duration / 60 * 7.5),
        }}
        onConfirm={handleConfirm}
      />
    </div>
  );
};