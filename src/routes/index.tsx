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
        index: true,
        element: (
          <ProtectedRoute>
            <RequireQuestionnaire>
              <Index />
            </RequireQuestionnaire>
          </ProtectedRoute>
        ),
      },
      ...profileRoutes.map(route => ({
        ...route,
        element: (
          <ProtectedRoute>
            <RequireQuestionnaire>
              {route.element}
            </RequireQuestionnaire>
          </ProtectedRoute>
        ),
      })),
      ...workoutRoutes.map(route => ({
        ...route,
        element: (
          <ProtectedRoute>
            <RequireQuestionnaire>
              {route.element}
            </RequireQuestionnaire>
          </ProtectedRoute>
        ),
      })),
      ...healthRoutes.map(route => ({
        ...route,
        element: (
          <ProtectedRoute>
            <RequireQuestionnaire>
              {route.element}
            </RequireQuestionnaire>
          </ProtectedRoute>
        ),
      })),
      ...dashboardRoutes.map(route => ({
        ...route,
        element: (
          <ProtectedRoute>
            <RequireQuestionnaire>
              {route.element}
            </RequireQuestionnaire>
          </ProtectedRoute>
        ),
      })),
    ],
  },
  ...authRoutes,
]);