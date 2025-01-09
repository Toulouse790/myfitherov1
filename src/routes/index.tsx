import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import Home from "@/pages/Home";
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";
import { InitialQuestionnaire } from "@/components/Profile/InitialQuestionnaire";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { CardioSession } from "@/components/Workouts/CardioSession";
import Cardio from "@/pages/Cardio";
import { WorkoutTypeSelection } from "@/components/Workouts/WorkoutTypeSelection";
import Workouts from "@/pages/Workouts";
import Profile from "@/pages/Profile";
import Nutrition from "@/pages/Nutrition";
import Sleep from "@/pages/Sleep";
import Stats from "@/pages/Stats";

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
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "initial-questionnaire",
        element: (
          <ProtectedRoute>
            <InitialQuestionnaire />
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
        path: "cardio-session/:sessionId",
        element: (
          <ProtectedRoute>
            <CardioSession />
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
        path: "workouts/type",
        element: (
          <ProtectedRoute>
            <WorkoutTypeSelection />
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
    ],
  },
]);