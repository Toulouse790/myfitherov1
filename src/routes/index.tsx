
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
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";
import { RequireAdmin } from "@/components/Auth/RequireAdmin";
import AppSettings from "@/pages/AppSettings";
import { debugLogger } from "@/utils/debug-logger";

// Routes principales
const SignInPage = lazy(() => import("@/pages/SignIn"));
const SignUpPage = lazy(() => import("@/pages/SignUp"));
const Index = lazy(() => import("@/pages/Index"));

// Routes du profil
const Profile = lazy(() => import("@/pages/Profile"));
const PersonalInfo = lazy(() => import("@/pages/PersonalInfo"));
const Subscription = lazy(() => import("@/pages/Subscription"));
const SubscriptionPlans = lazy(() => import("@/pages/SubscriptionPlans"));
const TrainingPreferences = lazy(() => import("@/pages/TrainingPreferences"));
const Notifications = lazy(() => import("@/pages/Notifications"));

// Routes d'entraînement
const Workouts = lazy(() => import("@/pages/workouts/index"));
const WorkoutGenerate = lazy(() => import("@/pages/WorkoutGenerate"));
const WorkoutSessionPage = lazy(() => import("@/pages/workouts/session/[id]"));
const StartWorkout = lazy(() => import("@/pages/workouts/start/[id]"));
const SportPrograms = lazy(() => import("@/pages/SportPrograms"));

// Routes santé
const Nutrition = lazy(() => import("@/pages/Nutrition"));
const Sleep = lazy(() => import("@/pages/Sleep"));
const Stats = lazy(() => import("@/pages/Stats"));
const Cardio = lazy(() => import("@/pages/Cardio"));

// Routes tableau de bord
const DashboardOverview = lazy(() => import("@/pages/Dashboard/Overview"));
const DashboardStreaks = lazy(() => import("@/pages/Dashboard/Streaks"));
const WeeklyGoals = lazy(() => import("@/pages/Goals/Weekly"));
const MonthlyGoals = lazy(() => import("@/pages/Goals/Monthly"));
const WeeklyReport = lazy(() => import("@/pages/Stats/WeeklyReport"));
const AchievementsHistory = lazy(() => import("@/pages/Achievements/History"));

// Route admin
const Admin = lazy(() => import("@/pages/Admin"));

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

// Définir un composant d'erreur avec des enfants pour l'ErrorBoundary
const ErrorPage = () => (
  <div>Une erreur est survenue</div>
);

debugLogger.log("Routes", "Initialisation des routes de l'application");

export const router = createBrowserRouter([
  // Routes d'authentification
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

  // Route Admin
  {
    path: "/admin",
    element: <RequireAdmin>{withSuspense(Admin)}</RequireAdmin>,
  },

  // Routes principales de l'application
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary><ErrorPage /></ErrorBoundary>,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          // Questionnaire initial
          {
            path: "initial-questionnaire",
            element: <InitialQuestionnaire />,
          },
          
          // Routes protégées qui nécessitent une authentification
          {
            element: <AuthenticatedLayout />,
            children: [
              // Route d'accueil
              {
                path: "/",
                element: withSuspense(Index)
              },
              
              // Routes de profil
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
                element: <AppSettings />
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
              
              // Routes d'entraînement
              {
                path: "workouts",
                element: withSuspense(Workouts)
              },
              {
                path: "workouts/generate",
                element: withSuspense(WorkoutGenerate)
              },
              {
                path: "workouts/session/:id",
                element: withSuspense(WorkoutSessionPage)
              },
              {
                path: "workouts/start/:id",
                element: withSuspense(StartWorkout)
              },
              {
                path: "workouts/:sessionId",
                element: <UnifiedWorkoutDetail />
              },
              {
                path: "sport-programs",
                element: withSuspense(SportPrograms)
              },
              
              // Routes santé
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
              
              // Routes tableau de bord
              {
                path: "dashboard/overview",
                element: <RequireQuestionnaire>{withSuspense(DashboardOverview)}</RequireQuestionnaire>
              },
              {
                path: "dashboard/streaks",
                element: <RequireQuestionnaire>{withSuspense(DashboardStreaks)}</RequireQuestionnaire>
              },
              {
                path: "goals/weekly",
                element: <RequireQuestionnaire>{withSuspense(WeeklyGoals)}</RequireQuestionnaire>
              },
              {
                path: "goals/monthly",
                element: <RequireQuestionnaire>{withSuspense(MonthlyGoals)}</RequireQuestionnaire>
              },
              {
                path: "stats/weekly-report",
                element: <RequireQuestionnaire>{withSuspense(WeeklyReport)}</RequireQuestionnaire>
              },
              {
                path: "achievements/history",
                element: <RequireQuestionnaire>{withSuspense(AchievementsHistory)}</RequireQuestionnaire>
              }
            ]
          }
        ]
      }
    ]
  }
]);
