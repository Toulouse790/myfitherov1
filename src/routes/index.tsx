import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Stats from "@/pages/Stats";
import Sleep from "@/pages/Sleep";
import Nutrition from "@/pages/Nutrition";
import Workouts from "@/pages/Workouts";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";
import { CardioSession } from "@/components/Workouts/CardioSession";
import TrainingPreferences from "@/pages/TrainingPreferences";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
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
        path: "sleep",
        element: (
          <ProtectedRoute>
            <Sleep />
          </ProtectedRoute>
        ),
      },
      {
        path: "nutrition",
        element: (
          <ProtectedRoute>
            <Nutrition />
          </ProtectedRoute>
        ),
      },
      {
        path: "workouts",
        element: (
          <ProtectedRoute>
            <Workouts />
          </ProtectedRoute>
        ),
      },
      {
        path: "workout/:sessionId",
        element: (
          <ProtectedRoute>
            <UnifiedWorkoutDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "cardio-session/:sessionId",
        element: (
          <ProtectedRoute>
            <CardioSession />
          </ProtectedRoute>
        ),
      },
      {
        path: "workout-generate",
        element: (
          <ProtectedRoute>
            <WorkoutGenerate />
          </ProtectedRoute>
        ),
      },
      {
        path: "training-preferences",
        element: (
          <ProtectedRoute>
            <TrainingPreferences />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);