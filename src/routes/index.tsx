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
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import TrainingPreferences from "@/pages/TrainingPreferences";
import Home from "@/pages/Home";
import Workouts from "@/pages/Workouts";
import Nutrition from "@/pages/Nutrition";
import Sleep from "@/pages/Sleep";
import Stats from "@/pages/Stats";
import { InitialQuestionnaire } from "@/components/Profile/InitialQuestionnaire";
import WorkoutSession from "@/pages/WorkoutSession";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import Cardio from "@/pages/Cardio";
import DashboardOverview from "@/pages/Dashboard/Overview";
import DashboardStreaks from "@/pages/Dashboard/Streaks";
import WeeklyGoals from "@/pages/Goals/Weekly";
import MonthlyGoals from "@/pages/Goals/Monthly";
import Notifications from "@/pages/Notifications";
import WeeklyReport from "@/pages/Stats/WeeklyReport";
import AchievementsHistory from "@/pages/Achievements/History";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
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
        path: "training-preferences",
        element: (
          <ProtectedRoute>
            <TrainingPreferences />
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
        path: "workouts/session",
        element: (
          <ProtectedRoute>
            <WorkoutSession />
          </ProtectedRoute>
        ),
      },
      {
        path: "workouts/generate",
        element: (
          <ProtectedRoute>
            <WorkoutGenerate />
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
        path: "initial-questionnaire",
        element: (
          <ProtectedRoute>
            <InitialQuestionnaire />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        children: [
          {
            path: "overview",
            element: (
              <ProtectedRoute>
                <DashboardOverview />
              </ProtectedRoute>
            ),
          },
          {
            path: "streaks",
            element: (
              <ProtectedRoute>
                <DashboardStreaks />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "goals",
        children: [
          {
            path: "weekly",
            element: (
              <ProtectedRoute>
                <WeeklyGoals />
              </ProtectedRoute>
            ),
          },
          {
            path: "monthly",
            element: (
              <ProtectedRoute>
                <MonthlyGoals />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "subscription-plans",
        element: (
          <ProtectedRoute>
            <SubscriptionPlans />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "stats/weekly-report",
        element: (
          <ProtectedRoute>
            <WeeklyReport />
          </ProtectedRoute>
        ),
      },
      {
        path: "achievements/history",
        element: (
          <ProtectedRoute>
            <AchievementsHistory />
          </ProtectedRoute>
        ),
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
  }
]);
