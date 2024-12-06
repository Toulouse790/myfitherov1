import { useState } from "react";
import { WorkoutProgress } from "./NextWorkoutDetail/WorkoutProgress";
import { WorkoutContent } from "./NextWorkoutDetail/WorkoutContent";
import { EndWorkoutButton } from "./NextWorkoutDetail/EndWorkoutButton";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { CardioSession } from "./NextWorkoutDetail/CardioSession";
import { useWorkoutSession } from "@/hooks/use-workout-session";

export const NextWorkoutDetail = () => {
  const {
    user,
    sessionId,
    isCardio,
    duration,
    isRunning,
    exercises,
    currentExerciseIndex,
    workoutStarted,
    setIsRunning,
    handleRegenerateWorkout,
    handleExerciseClick,
    handleConfirmEndWorkout
  } = useWorkoutSession();

  const [showSummary, setShowSummary] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const progress = exercises.length > 0 
    ? (completedExercises.length / exercises.length) * 100 
    : 0;

  const handleStartWorkout = () => {
    setIsRunning(true);
    handleExerciseClick(0);
  };

  const handleEndWorkout = () => {
    setShowSummary(true);
  };

  const handleExerciseComplete = (index: number) => {
    if (!completedExercises.includes(index)) {
      setCompletedExercises(prev => [...prev, index]);
    }
    
    if (index < exercises.length - 1) {
      handleExerciseClick(index + 1);
    }
  };

  if (!user) return null;

  if (isCardio) {
    return (
      <CardioSession
        sessionId={sessionId}
        duration={duration}
        isRunning={isRunning}
        userId={user.id}
        setIsRunning={setIsRunning}
      />
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
      <WorkoutProgress
        duration={duration}
        progress={progress}
        workoutStarted={workoutStarted}
        onStartWorkout={handleStartWorkout}
      />

      <WorkoutContent
        exercises={exercises}
        currentExerciseIndex={currentExerciseIndex}
        workoutStarted={workoutStarted}
        completedExercises={completedExercises}
        sessionId={sessionId}
        onExerciseClick={handleExerciseClick}
        onRegenerateWorkout={handleRegenerateWorkout}
        onExerciseComplete={handleExerciseComplete}
      />

      <EndWorkoutButton
        workoutStarted={workoutStarted}
        onEndWorkout={handleEndWorkout}
      />

      <WorkoutSummaryDialog
        open={showSummary}
        onOpenChange={setShowSummary}
        stats={{
          duration: Math.round(duration / 60),
          totalWeight: 0,
          totalCalories: 0
        }}
        onConfirm={handleConfirmEndWorkout}
      />
    </div>
  );
};