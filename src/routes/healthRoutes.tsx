import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import Nutrition from "@/pages/Nutrition";
import Sleep from "@/pages/Sleep";
import Stats from "@/pages/Stats";
import Cardio from "@/pages/Cardio";

export const healthRoutes = [
  {
    path: "nutrition",
    element: (
      <ProtectedRoute>
        <Nutrition />
      </ProtectedRoute>
    ),
  },
  {
    path: "sleep",
    element: (
      <ProtectedRoute>
        <Sleep />
      </ProtectedRoute>
    ),
  },
  {
    path: "stats",
    element: (
      <ProtectedRoute>
        <Stats />
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