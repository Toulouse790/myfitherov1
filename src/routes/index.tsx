
import { createBrowserRouter } from "react-router-dom";
import Index from "../pages/Index";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import { ProtectedRoute } from "../components/Auth/ProtectedRoute";
import DashboardOverview from "../pages/Dashboard/Overview";
import WorkoutSession from "../pages/WorkoutSession";
import Home from "../pages/Home";
import Workouts from "../pages/Workouts";
import Stats from "../pages/Stats";
import Nutrition from "../pages/Nutrition";
import SubscriptionPlans from "../pages/SubscriptionPlans";
import WorkoutGenerate from "../pages/WorkoutGenerate";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  // Routes protégées
  {
    path: "/home",
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: "/workouts/*",
    element: <ProtectedRoute><Workouts /></ProtectedRoute>
  },
  {
    path: "/workouts/generate",
    element: <ProtectedRoute><WorkoutGenerate /></ProtectedRoute>
  },
  {
    path: "/workout/:id",
    element: <ProtectedRoute><WorkoutSession /></ProtectedRoute>
  },
  {
    path: "/stats/*",
    element: <ProtectedRoute><Stats /></ProtectedRoute>
  },
  {
    path: "/dashboard/*",
    element: <ProtectedRoute><DashboardOverview /></ProtectedRoute>
  },
  {
    path: "/nutrition/*",
    element: <ProtectedRoute><Nutrition /></ProtectedRoute>
  },
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>
  },
  {
    path: "/subscription-plans",
    element: <ProtectedRoute><SubscriptionPlans /></ProtectedRoute>
  },
]);
