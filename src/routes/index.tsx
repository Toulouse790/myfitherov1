import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import Home from "@/pages/Home";
import Cardio from "@/pages/Cardio";
import { Workouts } from "@/pages/Workouts";
import { NextWorkoutDetail } from "@/components/Workouts/NextWorkoutDetail";
import { CardioSession } from "@/components/Workouts/CardioSession";
import Admin from "@/pages/Admin";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
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
      {
        path: "/admin/*",
        element: <Admin />
      }
    ]
  }
]);