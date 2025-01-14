import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import Index from "@/pages/Index";
import WorkoutSession from "@/pages/WorkoutSession";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ExerciseLibrary } from "@/components/Workouts/ExerciseLibrary";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/workout-session",
        element: <WorkoutSession />,
      },
      {
        path: "/workouts",
        element: <ExerciseLibrary />,
      },
    ],
  },
]);