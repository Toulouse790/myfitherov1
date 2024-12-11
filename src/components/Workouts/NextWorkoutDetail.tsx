import { useParams } from "react-router-dom";
import { useWorkoutSession } from "@/hooks/workout/use-workout-session";
import { useState, useEffect } from "react";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { NoSessionView } from "./NextWorkoutDetail/NoSessionView";
import { WorkoutProgress } from "./NextWorkoutDetail/WorkoutProgress";
import { WorkoutExerciseView } from "./NextWorkoutDetail/WorkoutExerciseView";

export const NextWorkoutDetail = () => {
  const { sessionId } = useParams();
  const { 
    exercises, 
    currentExerciseIndex, 
    workoutStarted, 
    duration,
    handleConfirmEndWorkout, 
    handleExerciseClick,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer
  } = useWorkoutSession();
  const [showSummary, setShowSummary] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(90);

  useEffect(() => {
    if (workoutStarted) {
      console.log("Workout started");
      startTimer();
    }

    return () => {
      console.log("Cleaning up workout session");
      stopTimer();
    };
  }, [workoutStarted, startTimer, stopTimer]);

  const handleEndWorkout = () => {
    stopTimer();
    setShowSummary(true);
  };

  const handleConfirm = (difficulty: string, duration: number, muscleGroups: string[]) => {
    handleConfirmEndWorkout(difficulty, duration, muscleGroups);
  };

  const handleSetComplete = () => {
    console.log("Set completed, starting rest timer");
    if (currentSet < 3) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTime(90);
    } else {
      setCurrentSet(1);
      setIsResting(false);
    }
  };

  const handleRestTimeChange = (newTime: number) => {
    setRestTime(prev => Math.max(15, prev + newTime));
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

  if (!sessionId) {
    return <NoSessionView />;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <WorkoutProgress
        duration={duration}
        progress={((currentExerciseIndex || 0) / (exercises.length || 1)) * 100}
        workoutStarted={workoutStarted}
        onStartWorkout={() => handleExerciseClick(0)}
      />

      <div className="bg-background p-4 sm:p-6 rounded-lg">
        <WorkoutExerciseView
          currentExercise={currentExerciseIndex !== null ? exercises[currentExerciseIndex] : null}
          currentExerciseIndex={currentExerciseIndex}
          exercises={exercises}
          currentSet={currentSet}
          isResting={isResting}
          sessionId={sessionId}
          restTime={restTime}
          onSetComplete={handleSetComplete}
          onSetsChange={handleSetsChange}
          onRestTimeChange={handleRestTimeChange}
          onExerciseSelect={handleExerciseSelect}
          onEndWorkout={handleEndWorkout}
          workoutStarted={workoutStarted}
        />
      </div>

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