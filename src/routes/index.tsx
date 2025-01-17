import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";
import HomePage from "@/pages/Home";
import WorkoutsPage from "@/pages/Workouts";
import WorkoutSessionPage from "@/pages/WorkoutSession";
import AdminDashboard from "@/pages/Admin/Dashboard";
import NutritionPage from "@/pages/Nutrition";
import SleepPage from "@/pages/Sleep";
import SuggestionsPage from "@/pages/Suggestions";
import WorkoutGeneratePage from "@/pages/WorkoutGenerate";
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
        path: "suggestions",
        element: (
          <ProtectedRoute>
            <SuggestionsPage />
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
        path: "workout-generate",
        element: (
          <ProtectedRoute>
            <WorkoutGeneratePage />
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
      {
        path: "nutrition",
        element: (
          <ProtectedRoute>
            <NutritionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "sleep",
        element: (
          <ProtectedRoute>
            <SleepPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
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