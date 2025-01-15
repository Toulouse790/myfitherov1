import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";
import HomePage from "@/pages/Home";
import WorkoutsPage from "@/pages/Workouts";
import WorkoutSessionPage from "@/pages/WorkoutSession";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "workouts",
        element: (
          <ProtectedRoute>
            <WorkoutsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "workouts/:sessionId",
        element: (
          <ProtectedRoute>
            <WorkoutSessionPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "signin",
    element: <SignInPage />,
  },
  {
    path: "signup",
    element: <SignUpPage />,
  },
]);