
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RootLayout } from "@/components/Layout/RootLayout";
import { AuthenticatedLayout } from "@/components/Layout/AuthenticatedLayout";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { RequireAdmin } from "@/components/Auth/RequireAdmin";
import { InitialQuestionnaire } from "@/components/Profile/InitialQuestionnaire";
import { debugLogger } from "@/utils/debug-logger";
import { HomeDashboard } from "@/composants/Maison/HomeDashboard";

import { authRoutes } from "./authRoutes";
import { profileRoutes } from "./profileRoutes";
import { workoutRoutes } from "./workoutRoutes";
import { healthRoutes } from "./healthRoutes";
import { dashboardRoutes } from "./dashboardRoutes";

const Admin = lazy(() => import("@/pages/Admin"));

debugLogger.log("Routes", "Initialisation des routes de l'application");

export const router = createBrowserRouter([
  // Routes d'authentification non protégées
  ...authRoutes,

  // Route Admin
  {
    path: "/admin",
    element: <RequireAdmin>{withSuspense(Admin)}</RequireAdmin>,
  },

  // Routes principales de l'application
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorBoundary><div>Une erreur est survenue</div></ErrorBoundary>,
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
                element: withSuspense(HomeDashboard),
              },
              
              // Groupes de routes
              ...profileRoutes,
              ...workoutRoutes,
              ...healthRoutes,
              ...dashboardRoutes,
            ]
          }
        ]
      }
    ]
  }
]);

function withSuspense(Component: React.LazyExoticComponent<any>) {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
}

const Loading = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);
