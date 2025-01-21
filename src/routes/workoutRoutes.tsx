import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import Workouts from "@/pages/Workouts";
import WorkoutSession from "@/pages/WorkoutSession";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import Cardio from "@/pages/Cardio";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";

export const workoutRoutes = [
  {
    path: "workouts",
    element: (
      <ProtectedRoute>
        <Workouts />
      </ProtectedRoute>
    ),
  },
  {
    path: "workouts/:sessionId",
    element: (
      <ProtectedRoute>
        <UnifiedWorkoutDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "workouts/session",
    element: (
      <ProtectedRoute>
        <WorkoutSession />
      </ProtectedRoute>
    ),
  },
  {
    path: "workouts/generate",
    element: (
      <ProtectedRoute>
        <WorkoutGenerate />
      </ProtectedRoute>
    ),
  },
  {
    path: "cardio",
    element: (
      <ProtectedRoute>
        <Cardio />
      </ProtectedRoute>
    ),
  },
];