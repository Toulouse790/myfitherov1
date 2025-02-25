
import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RootLayout } from "@/components/Layout/RootLayout";
import { AuthenticatedLayout } from "@/components/Layout/AuthenticatedLayout";
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
          // Route pour le questionnaire initial (sans RequireQuestionnaire)
          {
            path: "initial-questionnaire",
            element: <InitialQuestionnaire />,
          },
          
          // Toutes les autres routes protégées qui nécessitent le questionnaire
          {
            element: <AuthenticatedLayout />,
            children: [
              {
                path: "/",
                element: <Index />
              },
              // Routes du profil
              {
                path: "profile",
                element: <Profile />
              },
              {
                path: "personal-info",
                element: <PersonalInfo />
              },
              {
                path: "app-settings",
                element: <AppSettings />
              },
              {
                path: "subscription",
                element: <Subscription />
              },
              {
                path: "subscription-plans",
                element: <SubscriptionPlans />
              },
              {
                path: "training-preferences",
                element: <TrainingPreferences />
              },
              {
                path: "notifications",
                element: <Notifications />
              },
              // Routes des entraînements
              {
                path: "workouts",
                element: <Workouts />
              },
              {
                path: "workouts/:sessionId",
                element: <UnifiedWorkoutDetail />
              },
              {
                path: "workouts/generate",
                element: <WorkoutGenerate />
              },
              // Routes de santé
              {
                path: "nutrition",
                element: <Nutrition />
              },
              {
                path: "sleep",
                element: <Sleep />
              },
              {
                path: "stats",
                element: <Stats />
              },
              {
                path: "cardio",
                element: <Cardio />
              },
              // Routes du tableau de bord
              {
                path: "dashboard/overview",
                element: <DashboardOverview />
              },
              {
                path: "dashboard/streaks",
                element: <DashboardStreaks />
              },
              {
                path: "goals/weekly",
                element: <WeeklyGoals />
              },
              {
                path: "goals/monthly",
                element: <MonthlyGoals />
              },
              {
                path: "stats/weekly-report",
                element: <WeeklyReport />
              },
              {
                path: "achievements/history",
                element: <AchievementsHistory />
              }
            ]
          }
        ]
      }
    ]
  }
]);
