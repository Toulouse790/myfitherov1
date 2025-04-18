import { lazy } from "react";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";
import { withSuspense } from "@/utils/route-utils";

const Workouts = lazy(() => import("@/pages/workouts/index"));
const WorkoutGenerate = lazy(() => import("@/pages/WorkoutGenerate"));
const WorkoutSessionPage = lazy(() => import("@/pages/workouts/session/[id]"));
const StartWorkout = lazy(() => import("@/pages/workouts/start/[id]"));
const SportPrograms = lazy(() => import("@/pages/SportPrograms"));

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
    path: "workouts/session/:id",
    element: withSuspense(WorkoutSessionPage)
  },
  {
    path: "workouts/start/:id",
    element: withSuspense(StartWorkout)
  },
  {
    path: "workouts/:sessionId",
    element: <UnifiedWorkoutDetail />
  },
  {
    path: "sport-programs",
    element: withSuspense(SportPrograms)
  }
];
