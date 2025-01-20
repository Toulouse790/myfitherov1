import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RootLayout } from "@/components/Layout/RootLayout";
import { AdminLayout } from "@/components/Admin/AdminLayout";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";
import { AdminExercises } from "@/components/Admin/AdminExercises";
import { AdminMedia } from "@/components/Admin/AdminMedia";
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";
import { ForgotPassword } from "@/components/Auth/ForgotPassword";
import { ResetPassword } from "@/components/Auth/ResetPassword";
import { Dashboard } from "@/components/Dashboard";
import { Workouts } from "@/components/Workouts";
import { WorkoutSession } from "@/components/Workouts/WorkoutSession";
import { WorkoutCustomization } from "@/components/Workouts/WorkoutCustomization";
import { WorkoutSummary } from "@/components/Workouts/WorkoutSummary";
import { ExerciseLibrary } from "@/components/Workouts/ExerciseLibrary";
import { Nutrition } from "@/components/Nutrition";
import { Sleep } from "@/components/Sleep";
import { Stats } from "@/components/Stats";
import Profile from "@/pages/Profile";
import PersonalInfo from "@/pages/PersonalInfo";
import AppSettings from "@/pages/AppSettings";
import Subscription from "@/pages/Subscription";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
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
        path: "workouts/exercise/library",
        element: (
          <ProtectedRoute>
            <ExerciseLibrary />
          </ProtectedRoute>
        ),
      },
      {
        path: "workouts/customize",
        element: (
          <ProtectedRoute>
            <WorkoutCustomization />
          </ProtectedRoute>
        ),
      },
      {
        path: "workouts/summary",
        element: (
          <ProtectedRoute>
            <WorkoutSummary />
          </ProtectedRoute>
        ),
      },
      {
        path: "workouts/session/:sessionId",
        element: (
          <ProtectedRoute>
            <WorkoutSession />
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
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "personal-info",
        element: (
          <ProtectedRoute>
            <PersonalInfo />
          </ProtectedRoute>
        ),
      },
      {
        path: "app-settings",
        element: (
          <ProtectedRoute>
            <AppSettings />
          </ProtectedRoute>
        ),
      },
      {
        path: "subscription",
        element: (
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "exercises",
            element: <AdminExercises />,
          },
          {
            path: "media",
            element: <AdminMedia />,
          },
        ],
      },
    ],
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
    path: "forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "reset-password",
    element: <ResetPassword />,
  },
]);
