import { useSearchParams } from "react-router-dom";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useState } from "react";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { EndWorkoutButton } from "./NextWorkoutDetail/EndWorkoutButton";
import { useToast } from "@/hooks/use-toast";
import { NoSessionView } from "./NextWorkoutDetail/NoSessionView";
import { WorkoutExerciseView } from "./NextWorkoutDetail/WorkoutExerciseView";

export const NextWorkoutDetail = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const { exercises, currentExerciseIndex, workoutStarted, duration, handleConfirmEndWorkout, handleExerciseClick } = useWorkoutSession();
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
    console.log("Nouveau nombre de séries:", newSets);
  };

  const handleExerciseSelect = (index: number) => {
    if (currentExerciseIndex !== index) {
      setCurrentSet(1);
      setIsResting(false);
      handleExerciseClick(index);
    }
  };

  const progress = currentExerciseIndex !== null 
    ? ((currentExerciseIndex + (currentSet - 1) / 3) / exercises.length) * 100
    : 0;

  if (!sessionId) {
    return <NoSessionView />;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 sm:p-6 rounded-lg">
        <WorkoutExerciseView
          currentExercise={currentExerciseIndex !== null ? exercises[currentExerciseIndex] : null}
          currentExerciseIndex={currentExerciseIndex}
          exercises={exercises}
          currentSet={currentSet}
          isResting={isResting}
          progress={progress}
          sessionId={sessionId}
          restTime={restTime}
          onSetComplete={handleSetComplete}
          onSetsChange={handleSetsChange}
          onRestTimeChange={handleRestTimeChange}
          onExerciseSelect={handleExerciseSelect}
        />
      </div>

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