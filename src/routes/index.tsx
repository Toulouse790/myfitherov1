
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

// Importer les utilitaires depuis un fichier externe au lieu de les définir ici
import { withSuspense, Loading } from "@/utils/route-utils";

const Admin = lazy(() => import("@/pages/Admin"));
const Home = lazy(() => import("@/pages/Home"));
const Index = lazy(() => import("@/pages/Index"));

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
              // Routes authentifiées
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
