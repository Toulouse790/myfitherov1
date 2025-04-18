
import { lazy } from "react";
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";

const DashboardOverview = lazy(() => import("@/pages/Dashboard/Overview"));
const DashboardStreaks = lazy(() => import("@/pages/Dashboard/Streaks"));
const WeeklyGoals = lazy(() => import("@/pages/Goals/Weekly"));
const MonthlyGoals = lazy(() => import("@/pages/Goals/Monthly"));
const WeeklyReport = lazy(() => import("@/pages/Stats/WeeklyReport"));
const AchievementsHistory = lazy(() => import("@/pages/Achievements/History"));

export const dashboardRoutes = [
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
