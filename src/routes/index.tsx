import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import { Workouts } from "@/pages/Workouts";
import Stats from "@/pages/Stats";
import Sleep from "@/pages/Sleep";
import Nutrition from "@/pages/Nutrition";
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { ExerciseLibrary } from "@/components/Workouts/ExerciseLibrary";
import { NextWorkoutDetail } from "@/components/Workouts/NextWorkoutDetail";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import TrainingPreferences from "@/pages/TrainingPreferences";
import Cardio from "@/pages/Cardio";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
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
        path: "workouts/exercise/next-workout",
        element: (
          <ProtectedRoute>
            <NextWorkoutDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "workout/:sessionId",
        element: (
          <ProtectedRoute>
            <NextWorkoutDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "workouts/generate",
        element: (
          <ProtectedRoute>
            <WorkoutGenerate />
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
        path: "cardio",
        element: (
          <ProtectedRoute>
            <Cardio />
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
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
    ],
  },
]);