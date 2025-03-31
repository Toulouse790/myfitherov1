
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";
import Workouts from "@/pages/workouts/index"; // Updated import path to be explicit
import { WorkoutSession } from "@/components/Workouts/WorkoutSession";
import WorkoutGenerate from "@/pages/WorkoutGenerate";

export const workoutRoutes = [
  {
    path: "workouts",
    element: <RequireQuestionnaire><Workouts /></RequireQuestionnaire>,
  },
  {
    path: "workouts/:sessionId",
    element: <RequireQuestionnaire><WorkoutSession /></RequireQuestionnaire>,
  },
  {
    path: "workouts/generate",
    element: <RequireQuestionnaire><WorkoutGenerate /></RequireQuestionnaire>,
  },
];
