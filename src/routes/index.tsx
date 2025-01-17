import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/components/Layout/RootLayout";
import HomePage from "@/pages/Home";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";
import WorkoutsPage from "@/pages/Workouts";
import WorkoutSessionPage from "@/pages/WorkoutSession";
import NutritionPage from "@/pages/Nutrition";
import CardioPage from "@/pages/Cardio";
import SleepPage from "@/pages/Sleep";
import SuggestionsPage from "@/pages/Suggestions";
import WorkoutGeneratePage from "@/pages/WorkoutGenerate";
import StatsPage from "@/pages/Stats";
import ProfilePage from "@/pages/Profile";
import TrainingPreferencesPage from "@/pages/TrainingPreferences";
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
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
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
        path: "workout-session",
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
        path: "cardio",
        element: (
          <ProtectedRoute>
            <CardioPage />
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
        path: "suggestions",
        element: (
          <ProtectedRoute>
            <SuggestionsPage />
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
        path: "stats",
        element: (
          <ProtectedRoute>
            <StatsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "training-preferences",
        element: (
          <ProtectedRoute>
            <TrainingPreferencesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <div>Admin Dashboard</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
]);