
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
import AppSettings from "@/pages/AppSettings";
import { workoutRoutes } from "./workoutRoutes";
import { adminRoutes } from "./adminRoutes";

const SignInPage = lazy(() => import("@/pages/SignIn"));
const SignUpPage = lazy(() => import("@/pages/SignUp"));

const Index = lazy(() => import("@/pages/Index"));
const Profile = lazy(() => import("@/pages/Profile"));
// Correction: utiliser le bon chemin pour Workouts pour éviter le conflit
const Workouts = lazy(() => import("@/pages/workouts/index"));
const PersonalInfo = lazy(() => import("@/pages/PersonalInfo"));
const Subscription = lazy(() => import("@/pages/Subscription"));
const SubscriptionPlans = lazy(() => import("@/pages/SubscriptionPlans"));
const TrainingPreferences = lazy(() => import("@/pages/TrainingPreferences"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const WorkoutGenerate = lazy(() => import("@/pages/WorkoutGenerate"));
const Nutrition = lazy(() => import("@/pages/Nutrition"));
const Sleep = lazy(() => import("@/pages/Sleep"));
const Stats = lazy(() => import("@/pages/Stats"));
const Cardio = lazy(() => import("@/pages/Cardio"));

const DashboardOverview = lazy(() => import("@/pages/Dashboard/Overview"));
const DashboardStreaks = lazy(() => import("@/pages/Dashboard/Streaks"));
const WeeklyGoals = lazy(() => import("@/pages/Goals/Weekly"));
const MonthlyGoals = lazy(() => import("@/pages/Goals/Monthly"));
const WeeklyReport = lazy(() => import("@/pages/Stats/WeeklyReport"));
const AchievementsHistory = lazy(() => import("@/pages/Achievements/History"));

const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

const AppSettingsWithSuspense = (
  <AppSettings />
);

// Définir un composant d'erreur avec des enfants pour l'ErrorBoundary
const ErrorPage = () => (
  <div>Une erreur est survenue</div>
);

export const router = createBrowserRouter([
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

  {
    path: "/",
    element: <RootLayout />,
    // Correction: Fournir un enfant à ErrorBoundary
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "initial-questionnaire",
            element: <InitialQuestionnaire />,
          },
          {
            element: <AuthenticatedLayout />,
            children: [
              {
                path: "/",
                element: withSuspense(Index)
              },
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
                element: AppSettingsWithSuspense
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
              // Retiré l'entrée ici pour éviter le conflit avec les routes dans workoutRoutes
              // La page principale workouts sera gérée par les workoutRoutes
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
  },
  ...workoutRoutes,
  ...adminRoutes
]);
