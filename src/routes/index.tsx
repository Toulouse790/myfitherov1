import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Workouts from "@/pages/Workouts";
import Nutrition from "@/pages/Nutrition";
import Sleep from "@/pages/Sleep";
import Stats from "@/pages/Stats";
import Cardio from "@/pages/Cardio";
import { ExerciseLibrary } from "@/components/Workouts/ExerciseLibrary";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
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
        path: "workouts",
        element: (
          <ProtectedRoute>
            <Workouts />
          </ProtectedRoute>
        ),
      },
      {
        path: "workouts/exercise/library",
        element: (
          <ProtectedRoute>
            <ExerciseLibrary />
          </ProtectedRoute>
        ),
      },
      {
        path: "workouts/:sessionId",
        element: (
          <ProtectedRoute>
            <UnifiedWorkoutDetail />
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
      }
    ],
  },
]);