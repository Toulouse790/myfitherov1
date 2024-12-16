import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import { Workouts } from "@/pages/Workouts";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MediaManager } from "@/components/Admin/MediaManager";
import { RootLayout } from "@/components/Layout/RootLayout";
import AdminDashboard from "@/pages/Admin/Dashboard";
import Nutrition from "@/pages/Nutrition";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
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
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
      },
      {
        path: "/workouts",
        element: (
          <ProtectedRoute>
            <Workouts />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
      },
      {
        path: "/workouts/generate",
        element: (
          <ProtectedRoute>
            <WorkoutGenerate />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
      },
      {
        path: "/workout/:sessionId",
        element: (
          <ProtectedRoute>
            <UnifiedWorkoutDetail />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
      },
      {
        path: "/admin/media",
        element: (
          <ProtectedRoute>
            <MediaManager />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
      },
      {
        path: "/nutrition",
        element: (
          <ProtectedRoute>
            <Nutrition />
          </ProtectedRoute>
        ),
        errorElement: <ErrorBoundary />
      }
    ]
  }
]);