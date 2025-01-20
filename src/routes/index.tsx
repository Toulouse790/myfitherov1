import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RootLayout } from "@/components/Layout/RootLayout";
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";
import Profile from "@/pages/Profile";
import PersonalInfo from "@/pages/PersonalInfo";
import AppSettings from "@/pages/AppSettings";
import Subscription from "@/pages/Subscription";
import TrainingPreferences from "@/pages/TrainingPreferences";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
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
        path: "training-preferences",
        element: (
          <ProtectedRoute>
            <TrainingPreferences />
          </ProtectedRoute>
        ),
      }
    ],
  },
  {
    path: "signin",
    element: <SignIn />,
  },
  {
    path: "signup",
    element: <SignUp />,
  }
]);