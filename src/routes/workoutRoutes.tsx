
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";
import Workouts from "@/pages/workouts/index"; 
import { CleanWorkoutSession } from "@/components/Workouts/CleanWorkoutSession";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import StartWorkout from "@/pages/workouts/start/[id]";
import WorkoutSessionPage from "@/pages/workouts/session/[id]";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";
import SportPrograms from "@/pages/SportPrograms";

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
    path: "sport-programs",
    element: <RequireQuestionnaire><SportPrograms /></RequireQuestionnaire>,
  },
  // L'ordre des routes est important - les routes les plus spécifiques d'abord
  {
    path: "workouts/session/:id",
    element: <RequireQuestionnaire><WorkoutSessionPage /></RequireQuestionnaire>,
  },
  {
    path: "workouts/start/:id",
    element: <RequireQuestionnaire><StartWorkout /></RequireQuestionnaire>,
  },
  // Cette route doit être la dernière car elle est plus générique
  {
    path: "workouts/:sessionId",
    element: <RequireQuestionnaire><CleanWorkoutSession /></RequireQuestionnaire>,
  },
];
