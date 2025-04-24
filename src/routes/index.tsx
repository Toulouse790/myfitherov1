
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RootLayout } from "@/components/Layout/RootLayout";
import { AuthenticatedLayout } from "@/components/Layout/AuthenticatedLayout";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { RequireAdmin } from "@/components/Auth/RequireAdmin";
import { debugLogger } from "@/utils/debug-logger";

import { authRoutes } from "./authRoutes";
import { profileRoutes } from "./profileRoutes";
import { workoutRoutes } from "./workoutRoutes";
import { healthRoutes } from "./healthRoutes";
import { dashboardRoutes } from "./dashboardRoutes";

// Import utilities from external file
import { withSuspense } from "@/utils/route-utils";

const Admin = lazy(() => import("@/pages/Admin"));
const Home = lazy(() => import("@/pages/Home"));
const Index = lazy(() => import("@/pages/Index"));
const Stats = lazy(() => import("@/pages/Stats"));
const WeeklyReport = lazy(() => import("@/pages/Stats/WeeklyReport"));

debugLogger.log("Routes", "Initialisation des routes de l'application");

export const router = createBrowserRouter([
  // Routes d'authentification non protégées  
  ...authRoutes,

  // Route Admin
  {
    path: "/admin",
    element: <RequireAdmin>{withSuspense(Admin)}</RequireAdmin>,
  },
  
  // Routes Stats au niveau racine pour un accès direct
  {
    path: "/stats",
    element: <ProtectedRoute>{withSuspense(Stats)}</ProtectedRoute>,
  },
  {
    path: "/stats/weekly",
    element: <ProtectedRoute>{withSuspense(WeeklyReport)}</ProtectedRoute>,
  },

  // Routes principales de l'application
  {
    path: "/",
    element: <RootLayout />,
    errorElement: (
      <ErrorBoundary>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-xl font-semibold mb-2">Une erreur est survenue</h2>
          <p className="text-muted-foreground">Veuillez réessayer plus tard</p>
        </div>
      </ErrorBoundary>
    ),
    children: [
      {
        // Route initiale indexée 
        index: true, 
        element: withSuspense(Index)
      },
      {
        // Routes protégées nécessitant une authentification
        element: <ProtectedRoute />,
        children: [
          {
            element: <AuthenticatedLayout />,
            children: [
              {
                path: "home",
                element: withSuspense(Home),
              },
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
