
import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RootLayout } from "@/components/Layout/RootLayout";
import { AuthenticatedLayout } from "@/components/Layout/AuthenticatedLayout";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { lazy, Suspense } from "react";
import { AuthConfirmPage } from "@/pages/AuthConfirm";
import { InitialQuestionnaire } from "@/components/Profile/InitialQuestionnaire";
import { UnifiedWorkoutDetail } from "@/components/Workouts/UnifiedWorkoutDetail";
import { QuestionnaireCompleteHandler } from "@/components/Profile/QuestionnaireCompleteHandler";

// Pages d'authentification
const SignInPage = lazy(() => import("@/pages/SignIn"));
const SignUpPage = lazy(() => import("@/pages/SignUp"));

// Pages principales
const Index = lazy(() => import("@/pages/Index"));
const Profile = lazy(() => import("@/pages/Profile"));
const Workouts = lazy(() => import("@/pages/Workouts"));
const PersonalInfo = lazy(() => import("@/pages/PersonalInfo"));
const AppSettings = lazy(() => import("@/pages/AppSettings"));
const Subscription = lazy(() => import("@/pages/Subscription"));
const SubscriptionPlans = lazy(() => import("@/pages/SubscriptionPlans"));
const TrainingPreferences = lazy(() => import("@/pages/TrainingPreferences"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const WorkoutGenerate = lazy(() => import("@/pages/WorkoutGenerate"));
const Nutrition = lazy(() => import("@/pages/Nutrition"));
const Sleep = lazy(() => import("@/pages/Sleep"));
const Stats = lazy(() => import("@/pages/Stats"));
const Cardio = lazy(() => import("@/pages/Cardio"));

// Pages du tableau de bord
const DashboardOverview = lazy(() => import("@/pages/Dashboard/Overview"));
const DashboardStreaks = lazy(() => import("@/pages/Dashboard/Streaks"));
const WeeklyGoals = lazy(() => import("@/pages/Goals/Weekly"));
const MonthlyGoals = lazy(() => import("@/pages/Goals/Monthly"));
const WeeklyReport = lazy(() => import("@/pages/Stats/WeeklyReport"));
const AchievementsHistory = lazy(() => import("@/pages/Achievements/History"));

// Composant de chargement
const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

// Wrapper pour le chargement paresseux
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Routes publiques
  {
    path: "/signin",
    element: withSuspense(SignInPage),
  },
  {
    path: "/signup",
    element: withSuspense(SignUpPage),
  },
  {
    path: "/auth/confirm",
    element: <AuthConfirmPage />,
  },
  {
    path: "/questionnaire-complete",
    element: <QuestionnaireCompleteHandler />,
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
                element: withSuspense(Index)
              },
              // Routes du profil
              {
                path: "profile",
                element: withSuspense(Profile)
              },
              {
                path: "personal-info",
                element: withSuspense(PersonalInfo)
              },
              {
                path: "app-settings",
                element: withSuspense(AppSettings)
              },
              {
                path: "subscription",
                element: withSuspense(Subscription)
              },
              {
                path: "subscription-plans",
                element: withSuspense(SubscriptionPlans)
              },
              {
                path: "training-preferences",
                element: withSuspense(TrainingPreferences)
              },
              {
                path: "notifications",
                element: withSuspense(Notifications)
              },
              // Routes des entraînements
              {
                path: "workouts",
                element: withSuspense(Workouts)
              },
              {
                path: "workouts/generate",
                element: withSuspense(WorkoutGenerate)
              },
              {
                path: "workouts/:sessionId",
                element: <UnifiedWorkoutDetail />
              },
              // Routes de santé
              {
                path: "nutrition",
                element: withSuspense(Nutrition)
              },
              {
                path: "sleep",
                element: withSuspense(Sleep)
              },
              {
                path: "stats",
                element: withSuspense(Stats)
              },
              {
                path: "cardio",
                element: withSuspense(Cardio)
              },
              // Routes du tableau de bord
              {
                path: "dashboard/overview",
                element: withSuspense(DashboardOverview)
              },
              {
                path: "dashboard/streaks",
                element: withSuspense(DashboardStreaks)
              },
              {
                path: "goals/weekly",
                element: withSuspense(WeeklyGoals)
              },
              {
                path: "goals/monthly",
                element: withSuspense(MonthlyGoals)
              },
              {
                path: "stats/weekly-report",
                element: withSuspense(WeeklyReport)
              },
              {
                path: "achievements/history",
                element: withSuspense(AchievementsHistory)
              }
            ]
          }
        ]
      }
    ]
  }
]);
