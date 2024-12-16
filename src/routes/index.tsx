import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import Cardio from "@/pages/Cardio";
import { Workouts } from "@/pages/Workouts";
import { NextWorkoutDetail } from "@/components/Workouts/NextWorkoutDetail";
import { CardioSession } from "@/components/Workouts/CardioSession";
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";
import Profile from "@/pages/Profile";
import Stats from "@/pages/Stats";
import Sleep from "@/pages/Sleep";
import Nutrition from "@/pages/Nutrition";
import TrainingPreferences from "@/pages/TrainingPreferences";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import { ExerciseLibrary } from "@/components/Workouts/ExerciseLibrary";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/signin",
        element: <SignIn />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/signup",
        element: <SignUp />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/profile",
        element: <Profile />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/cardio",
        element: <Cardio />,
        errorElement: <ErrorBoundary />
      },
      // Standardisation des chemins workout
      {
        path: "/workouts",
        element: <Workouts />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/workouts/library",
        element: <ExerciseLibrary />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/workouts/generate",
        element: <WorkoutGenerate />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/workouts/:sessionId",
        element: <NextWorkoutDetail />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/cardio-session/:sessionId",
        element: <CardioSession />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/nutrition",
        element: <Nutrition />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/stats",
        element: <Stats />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/sleep",
        element: <Sleep />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/training-preferences",
        element: <TrainingPreferences />,
        errorElement: <ErrorBoundary />
      }
    ]
  }
]);