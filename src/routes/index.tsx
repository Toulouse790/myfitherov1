import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import { Workouts } from "@/pages/Workouts";
import { WorkoutDetail } from "@/components/Workouts/WorkoutDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/workouts",
    element: (
      <ProtectedRoute>
        <Workouts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/workout/:sessionId",
    element: (
      <ProtectedRoute>
        <WorkoutDetail />
      </ProtectedRoute>
    ),
  },
]);