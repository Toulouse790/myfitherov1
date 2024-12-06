import { WorkoutHeader } from "./WorkoutHeader";
import { WorkoutLayout } from "./WorkoutLayout";
import { WorkoutInProgress } from "./WorkoutInProgress";
import { WorkoutSummaryDialog } from "./WorkoutSummaryDialog";
import { CardioSession } from "./CardioSession";
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

  if (!user) {
    return null;
  }

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
    <div className="container max-w-7xl mx-auto p-4 space-y-8">
      <WorkoutHeader title="Séance d'entraînement" />
      
      <WorkoutLayout
        exercises={exercises}
        currentExerciseIndex={currentExerciseIndex}
        onExerciseClick={handleExerciseClick}
        isWorkoutStarted={workoutStarted}
      />

      <WorkoutInProgress 
        exercises={exercises}
        currentExerciseIndex={currentExerciseIndex}
        onExerciseClick={handleExerciseClick}
        sessionId={sessionId}
        onRegenerateWorkout={handleRegenerateWorkout}
      />
      
      <WorkoutSummaryDialog 
        open={false} 
        onOpenChange={() => {}}
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