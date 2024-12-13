import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Home from "@/pages/Home";
import Cardio from "@/pages/Cardio";
import { Workouts } from "@/pages/Workouts";
import { NextWorkoutDetail } from "@/components/Workouts/NextWorkoutDetail";
import { CardioSession } from "@/components/Workouts/CardioSession";
import Admin from "@/pages/Admin";
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";

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
        path: "/admin/*",
        element: <Admin />,
        errorElement: <ErrorBoundary />
      }
    ]
  }
]);