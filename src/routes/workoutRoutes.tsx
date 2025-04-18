
import { lazy } from "react";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";
import { withSuspense } from "@/utils/route-utils";

const Workouts = lazy(() => import("@/pages/workouts/index"));
const WorkoutGenerate = lazy(() => import("@/pages/WorkoutGenerate"));
const WorkoutSession = lazy(() => import("@/components/Workouts/CleanWorkoutSession"));
const SportPrograms = lazy(() => import("@/pages/SportPrograms"));
const MuscleGroupSelection = lazy(() => import("@/components/Workouts/MuscleGroupSelection"));

export const workoutRoutes = [
  {
    path: "workouts",
    element: withSuspense(Workouts)
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
    element: withSuspense(WorkoutSession)
  },
  {
    path: "sport-programs",
    element: withSuspense(SportPrograms)
  }
];
