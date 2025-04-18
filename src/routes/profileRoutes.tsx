
import { lazy } from "react";
import AppSettings from "@/pages/AppSettings";

const Profile = lazy(() => import("@/pages/Profile"));
const PersonalInfo = lazy(() => import("@/pages/PersonalInfo"));
const Subscription = lazy(() => import("@/pages/Subscription"));
const SubscriptionPlans = lazy(() => import("@/pages/SubscriptionPlans"));
const TrainingPreferences = lazy(() => import("@/pages/TrainingPreferences"));
const Notifications = lazy(() => import("@/pages/Notifications"));

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
