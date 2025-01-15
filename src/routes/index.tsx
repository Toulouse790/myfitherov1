import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Profile from "@/pages/Profile";
import TrainingPreferences from "@/pages/TrainingPreferences";
import Workouts from "@/pages/Workouts";
import WorkoutSession from "@/pages/WorkoutSession";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import Suggestions from "@/pages/Suggestions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/training-preferences",
    element: <TrainingPreferences />,
  },
  {
    path: "/workouts",
    element: <Workouts />,
  },
  {
    path: "/workout-session",
    element: <WorkoutSession />,
  },
  {
    path: "/workout-generate",
    element: <WorkoutGenerate />,
  },
  {
    path: "/suggestions",
    element: <Suggestions />,
  },
]);