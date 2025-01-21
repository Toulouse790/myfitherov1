import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import DashboardOverview from "@/pages/Dashboard/Overview";
import DashboardStreaks from "@/pages/Dashboard/Streaks";
import WeeklyGoals from "@/pages/Goals/Weekly";
import MonthlyGoals from "@/pages/Goals/Monthly";
import WeeklyReport from "@/pages/Stats/WeeklyReport";
import AchievementsHistory from "@/pages/Achievements/History";

export const dashboardRoutes = [
  {
    path: "dashboard",
    children: [
      {
        path: "overview",
        element: (
          <ProtectedRoute>
            <DashboardOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: "streaks",
        element: (
          <ProtectedRoute>
            <DashboardStreaks />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "goals",
    children: [
      {
        path: "weekly",
        element: (
          <ProtectedRoute>
            <WeeklyGoals />
          </ProtectedRoute>
        ),
      },
      {
        path: "monthly",
        element: (
          <ProtectedRoute>
            <MonthlyGoals />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "stats/weekly-report",
    element: (
      <ProtectedRoute>
        <WeeklyReport />
      </ProtectedRoute>
    ),
  },
  {
    path: "achievements/history",
    element: (
      <ProtectedRoute>
        <AchievementsHistory />
      </ProtectedRoute>
    ),
  },
];