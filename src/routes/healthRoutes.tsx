
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";
import Nutrition from "@/pages/Nutrition";
import Sleep from "@/pages/Sleep";
import Stats from "@/pages/Stats";
import Cardio from "@/pages/Cardio";

export const healthRoutes = [
  {
    path: "nutrition",
    element: <RequireQuestionnaire><Nutrition /></RequireQuestionnaire>,
  },
  {
    path: "sleep",
    element: <RequireQuestionnaire><Sleep /></RequireQuestionnaire>,
  },
  {
    path: "stats",
    element: <RequireQuestionnaire><Stats /></RequireQuestionnaire>,
  },
  {
    path: "cardio",
    element: <RequireQuestionnaire><Cardio /></RequireQuestionnaire>,
  },
];
