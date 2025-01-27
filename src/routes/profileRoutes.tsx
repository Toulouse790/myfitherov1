import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import Profile from "@/pages/Profile";
import PersonalInfo from "@/pages/PersonalInfo";
import AppSettings from "@/pages/AppSettings";
import Subscription from "@/pages/Subscription";
import SubscriptionPlans from "@/pages/SubscriptionPlans";
import TrainingPreferences from "@/pages/TrainingPreferences";
import { InitialQuestionnaire } from "@/components/Profile/InitialQuestionnaire";
import Notifications from "@/pages/Notifications";

export const profileRoutes = [
  {
    path: "profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "initial-questionnaire",
    element: <InitialQuestionnaire />,
  },
  {
    path: "personal-info",
    element: (
      <ProtectedRoute>
        <PersonalInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: "app-settings",
    element: (
      <ProtectedRoute>
        <AppSettings />
      </ProtectedRoute>
    ),
  },
  {
    path: "subscription",
    element: (
      <ProtectedRoute>
        <Subscription />
      </ProtectedRoute>
    ),
  },
  {
    path: "subscription-plans",
    element: (
      <ProtectedRoute>
        <SubscriptionPlans />
      </ProtectedRoute>
    ),
  },
  {
    path: "training-preferences",
    element: (
      <ProtectedRoute>
        <TrainingPreferences />
      </ProtectedRoute>
    ),
  },
  {
    path: "notifications",
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
];