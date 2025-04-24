
import { lazy } from "react";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";
import { withSuspense } from "@/utils/route-utils";

// Import de la nouvelle page simplifiée 
const SimplifiedWorkoutPage = lazy(() => import("@/pages/workouts/SimplifiedIndex"));
const WorkoutGenerate = lazy(() => import("@/pages/WorkoutGenerate"));
const WorkoutSession = lazy(() => import("@/components/Workouts/CleanWorkoutSession"));
const SportPrograms = lazy(() => import("@/pages/SportPrograms"));
const MuscleGroupSelection = lazy(() => import("@/components/Workouts/MuscleGroupSelection"));
const WorkoutSessionPage = lazy(() => import("@/pages/workouts/session/[id]"));

export const workoutRoutes = [
  {
    path: "workouts",
    element: withSuspense(SimplifiedWorkoutPage)
  },
  {
    path: "workouts/generate",
    element: withSuspense(WorkoutGenerate)
  },
  {
    path: "workouts/create",
    element: withSuspense(MuscleGroupSelection)
  },
  {
    path: "workouts/session/:id",
    element: withSuspense(WorkoutSessionPage)
  },
  {
    path: "sport-programs",
    element: withSuspense(SportPrograms)
  }
];
