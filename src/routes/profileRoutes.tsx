
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";
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
    element: <RequireQuestionnaire><Profile /></RequireQuestionnaire>,
  },
  {
    path: "initial-questionnaire",
    element: <InitialQuestionnaire />,
  },
  {
    path: "personal-info",
    element: <RequireQuestionnaire><PersonalInfo /></RequireQuestionnaire>,
  },
  {
    path: "app-settings",
    element: <RequireQuestionnaire><AppSettings /></RequireQuestionnaire>,
  },
  {
    path: "subscription",
    element: <RequireQuestionnaire><Subscription /></RequireQuestionnaire>,
  },
  {
    path: "subscription-plans",
    element: <RequireQuestionnaire><SubscriptionPlans /></RequireQuestionnaire>,
  },
  {
    path: "training-preferences",
    element: <RequireQuestionnaire><TrainingPreferences /></RequireQuestionnaire>,
  },
  {
    path: "notifications",
    element: <RequireQuestionnaire><Notifications /></RequireQuestionnaire>,
  },
];
