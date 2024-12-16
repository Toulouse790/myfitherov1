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
import { WorkoutTypeSelection } from "@/components/Workouts/WorkoutTypeSelection";
import { WorkoutSetup } from "@/components/Workouts/WorkoutSetup";
import { WorkoutCustomization } from "@/components/Workouts/WorkoutCustomization";
import { WorkoutSummary } from "@/components/Workouts/WorkoutSummary";

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
        path: "/workouts/create",
        element: <WorkoutTypeSelection />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/workouts/setup",
        element: <WorkoutSetup />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/workouts/customize",
        element: <WorkoutCustomization />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/workouts/summary",
        element: <WorkoutSummary />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/workout/generate",
        element: <WorkoutGenerate />,
        errorElement: <ErrorBoundary />
      },
      {
        path: "/workout/:sessionId",
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