import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import { Home } from "@/pages/Home";
import { Profile } from "@/pages/Profile";
import { Workouts } from "@/pages/Workouts";
import { Stats } from "@/pages/Stats";
import { Sleep } from "@/pages/Sleep";
import { Nutrition } from "@/pages/Nutrition";
import { Cardio } from "@/pages/Cardio";
import { TrainingPreferences } from "@/pages/TrainingPreferences";
import { WorkoutGenerate } from "@/pages/WorkoutGenerate";
import { ExerciseLibrary } from "@/components/Workouts/ExerciseLibrary";

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
        path: "profile",
        element: <Profile />,
      },
      {
        path: "workouts",
        element: <Workouts />,
      },
      {
        path: "workouts/exercise/library",
        element: <ExerciseLibrary />,
      },
      {
        path: "stats",
        element: <Stats />,
      },
      {
        path: "sleep",
        element: <Sleep />,
      },
      {
        path: "nutrition",
        element: <Nutrition />,
      },
      {
        path: "cardio",
        element: <Cardio />,
      },
      {
        path: "training-preferences",
        element: <TrainingPreferences />,
      },
      {
        path: "workout-generate",
        element: <WorkoutGenerate />,
      },
    ],
  },
]);