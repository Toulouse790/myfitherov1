
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
  const { createWorkoutSession } = useWorkoutSession();

  if (!sessionId) {
    return <NoSessionView />;
  }

  return <UnifiedWorkoutDetail />;
};
