
import { lazy } from "react";
import AppSettings from "@/pages/AppSettings";
import { withSuspense } from "@/utils/route-utils";

const Profile = lazy(() => import("@/pages/Profile"));
const PersonalInfo = lazy(() => import("@/pages/PersonalInfo"));
const Subscription = lazy(() => import("@/pages/Subscription"));
const SubscriptionPlans = lazy(() => import("@/pages/SubscriptionPlans"));
const TrainingPreferences = lazy(() => import("@/pages/TrainingPreferences"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Settings = lazy(() => import("@/pages/Settings"));

export const profileRoutes = [
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
    path: "settings",
    element: withSuspense(Settings)
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
  }
];
