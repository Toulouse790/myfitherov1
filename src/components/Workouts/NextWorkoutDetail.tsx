import { useParams } from "react-router-dom";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useState, useEffect } from "react";
import { WorkoutSummaryDialog } from "./NextWorkoutDetail/WorkoutSummaryDialog";
import { NoSessionView } from "./NextWorkoutDetail/NoSessionView";
import { WorkoutProgress } from "./NextWorkoutDetail/WorkoutProgress";
import { WorkoutExerciseView } from "./NextWorkoutDetail/WorkoutExerciseView";
import { UnifiedWorkoutDetail } from "./UnifiedWorkoutDetail";

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
    setRestTime(prev => {
      const updatedTime = Math.max(15, Math.min(180, prev + newTime));
      console.log("Updating rest time to:", updatedTime);
      return updatedTime;
    });
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

  return <UnifiedWorkoutDetail />;
};