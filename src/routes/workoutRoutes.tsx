
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";
import Workouts from "@/pages/workouts/index"; 
import { WorkoutSession } from "@/components/Workouts/WorkoutSession";
import WorkoutGenerate from "@/pages/WorkoutGenerate";

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
    element: <RequireQuestionnaire><WorkoutSession /></RequireQuestionnaire>,
  },
];
