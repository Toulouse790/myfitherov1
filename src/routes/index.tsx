import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RootLayout } from "@/components/Layout/RootLayout";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import Home from "@/pages/Home";
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
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      ...profileRoutes,
      ...workoutRoutes,
      ...healthRoutes,
      ...dashboardRoutes,
    ],
  },
  ...authRoutes,
]);