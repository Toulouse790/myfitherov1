
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";
import Workouts from "@/pages/workouts/index"; 
import { CleanWorkoutSession } from "@/components/Workouts/CleanWorkoutSession";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import StartWorkout from "@/pages/workouts/start/[id]";
import { WorkoutSession } from "@/components/Workouts/WorkoutSession";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";

export const workoutRoutes = [
  {
    path: "workouts",
    element: <RequireQuestionnaire><Workouts /></RequireQuestionnaire>,
  },
  {
    path: "workouts/generate",
    element: <RequireQuestionnaire><WorkoutGenerate /></RequireQuestionnaire>,
  },
  {
    path: "workouts/:sessionId",
    element: <RequireQuestionnaire><CleanWorkoutSession /></RequireQuestionnaire>,
  },
  {
    path: "workouts/session/:id",
    element: <RequireQuestionnaire><WorkoutSession /></RequireQuestionnaire>,
  },
  {
    path: "workouts/start/:id",
    element: <RequireQuestionnaire><StartWorkout /></RequireQuestionnaire>,
  },
];
