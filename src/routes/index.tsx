import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import FavoriteMeals from "@/pages/FavoriteMeals";
import Cardio from "@/pages/Cardio";
import Nutrition from "@/pages/Nutrition";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";
import Stats from "@/pages/Stats";
import WorkoutGenerate from "@/pages/WorkoutGenerate";
import Workouts from "@/pages/Workouts";
import TrainingPreferencesPage from "@/pages/TrainingPreferences";
import Sleep from "@/pages/Sleep";
import WorkoutSession from "@/pages/WorkoutSession";
import AdminDashboard from "@/pages/Admin/Dashboard";
import Index from "@/pages/Index";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/favorite-meals",
        element: (
          <ProtectedRoute>
            <FavoriteMeals />
          </ProtectedRoute>
        ),
      },
      {
        path: "/cardio",
        element: <Cardio />,
      },
      {
        path: "/nutrition",
        element: <Nutrition />,
      },
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/stats",
        element: <Stats />,
      },
      {
        path: "/workout-generate",
        element: <WorkoutGenerate />,
      },
      {
        path: "/workouts",
        element: <Workouts />,
      },
      {
        path: "/training-preferences",
        element: <TrainingPreferencesPage />,
      },
      {
        path: "/sleep",
        element: <Sleep />,
      },
      {
        path: "/workout-session/:sessionId",
        element: <WorkoutSession />,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
]);

export default router;