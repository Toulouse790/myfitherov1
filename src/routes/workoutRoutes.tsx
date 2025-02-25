
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";
import Workouts from "@/pages/Workouts";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";
import WorkoutGenerate from "@/pages/WorkoutGenerate";

export const workoutRoutes = [
  {
    path: "workouts",
    element: <RequireQuestionnaire><Workouts /></RequireQuestionnaire>,
  },
  {
    path: "workouts/:sessionId",
    element: <RequireQuestionnaire><UnifiedWorkoutDetail /></RequireQuestionnaire>,
  },
  {
    path: "workouts/generate",
    element: <RequireQuestionnaire><WorkoutGenerate /></RequireQuestionnaire>,
  },
];
