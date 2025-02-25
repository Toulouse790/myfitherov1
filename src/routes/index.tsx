
import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RootLayout } from "@/components/Layout/RootLayout";
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

// Pages d'authentification
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";
import { AuthConfirmPage } from "@/pages/AuthConfirm";

// Pages principales
import Index from "@/pages/Index";
import Profile from "@/pages/Profile";
import Workouts from "@/pages/Workouts";
import PersonalInfo from "@/pages/PersonalInfo";
import AppSettings from "@/pages/AppSettings";
import Subscription from "@/pages/Subscription";
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import TrainingPreferences from "@/pages/TrainingPreferences";
import { InitialQuestionnaire } from "@/components/Profile/InitialQuestionnaire";
import Notifications from "@/pages/Notifications";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";
import Nutrition from "@/pages/Nutrition";
import Sleep from "@/pages/Sleep";
import Stats from "@/pages/Stats";
import Cardio from "@/pages/Cardio";

// Pages du tableau de bord
import DashboardOverview from "@/pages/Dashboard/Overview";
import DashboardStreaks from "@/pages/Dashboard/Streaks";
import WeeklyGoals from "@/pages/Goals/Weekly";
import MonthlyGoals from "@/pages/Goals/Monthly";
import WeeklyReport from "@/pages/Stats/WeeklyReport";
import AchievementsHistory from "@/pages/Achievements/History";

export const router = createBrowserRouter([
  // Routes publiques
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/auth/confirm",
    element: <AuthConfirmPage />,
  },

  // Routes protégées
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <RequireQuestionnaire><Index /></RequireQuestionnaire>,
          },
          {
            path: "initial-questionnaire",
            element: <InitialQuestionnaire />,
          },
          // Routes du profil
          {
            path: "profile",
            element: <RequireQuestionnaire><Profile /></RequireQuestionnaire>,
          },
          {
            path: "personal-info",
            element: <RequireQuestionnaire><PersonalInfo /></RequireQuestionnaire>,
          },
          {
            path: "app-settings",
            element: <RequireQuestionnaire><AppSettings /></RequireQuestionnaire>,
          },
          {
            path: "subscription",
            element: <RequireQuestionnaire><Subscription /></RequireQuestionnaire>,
          },
          {
            path: "subscription-plans",
            element: <RequireQuestionnaire><SubscriptionPlans /></RequireQuestionnaire>,
          },
          {
            path: "training-preferences",
            element: <RequireQuestionnaire><TrainingPreferences /></RequireQuestionnaire>,
          },
          {
            path: "notifications",
            element: <RequireQuestionnaire><Notifications /></RequireQuestionnaire>,
          },
          // Routes des entraînements
          {
            path: "workouts",
            element: <RequireQuestionnaire><Workouts /></RequireQuestionnaire>,
          },
          {
            path: "workouts/:sessionId",
            element: <RequireQuestionnaire><UnifiedWorkoutDetail /></RequireQuestionnaire>,
          },
          {
            path: "workouts/generate",
            element: <RequireQuestionnaire><WorkoutGenerate /></RequireQuestionnaire>,
          },
          // Routes de santé
          {
            path: "nutrition",
            element: <RequireQuestionnaire><Nutrition /></RequireQuestionnaire>,
          },
          {
            path: "sleep",
            element: <RequireQuestionnaire><Sleep /></RequireQuestionnaire>,
          },
          {
            path: "stats",
            element: <RequireQuestionnaire><Stats /></RequireQuestionnaire>,
          },
          {
            path: "cardio",
            element: <RequireQuestionnaire><Cardio /></RequireQuestionnaire>,
          },
          // Routes du tableau de bord
          {
            path: "dashboard/overview",
            element: <RequireQuestionnaire><DashboardOverview /></RequireQuestionnaire>,
          },
          {
            path: "dashboard/streaks",
            element: <RequireQuestionnaire><DashboardStreaks /></RequireQuestionnaire>,
          },
          {
            path: "goals/weekly",
            element: <RequireQuestionnaire><WeeklyGoals /></RequireQuestionnaire>,
          },
          {
            path: "goals/monthly",
            element: <RequireQuestionnaire><MonthlyGoals /></RequireQuestionnaire>,
          },
          {
            path: "stats/weekly-report",
            element: <RequireQuestionnaire><WeeklyReport /></RequireQuestionnaire>,
          },
          {
            path: "achievements/history",
            element: <RequireQuestionnaire><AchievementsHistory /></RequireQuestionnaire>,
          }
        ],
      },
    ],
  }
]);
