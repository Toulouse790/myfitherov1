import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Cardio from "@/pages/Cardio";
import { Workouts } from "@/pages/Workouts";
import { NextWorkoutDetail } from "@/components/Workouts/NextWorkoutDetail";
import { CardioSession } from "@/components/Workouts/CardioSession";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/cardio",
    element: <Cardio />
  },
  {
    path: "/workouts",
    element: <Workouts />
  },
  {
    path: "/workout/:sessionId",
    element: <NextWorkoutDetail />
  },
  {
    path: "/cardio-session/:sessionId",
    element: <CardioSession />
  },
]);