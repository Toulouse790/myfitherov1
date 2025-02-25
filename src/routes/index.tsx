
import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RootLayout } from "@/components/Layout/RootLayout";
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import Index from "@/pages/Index";
import { authRoutes } from "./authRoutes";
import { profileRoutes } from "./profileRoutes";
import { workoutRoutes } from "./workoutRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { healthRoutes } from "./healthRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <RequireQuestionnaire><Index /></RequireQuestionnaire>,
          },
          ...profileRoutes,
          ...workoutRoutes,
          ...healthRoutes,
          ...dashboardRoutes,
        ],
      },
    ],
  },
  ...authRoutes,
]);
