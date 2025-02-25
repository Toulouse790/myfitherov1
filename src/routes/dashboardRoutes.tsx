
import { RequireQuestionnaire } from "@/components/Auth/RequireQuestionnaire";
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
        element: <RequireQuestionnaire><DashboardOverview /></RequireQuestionnaire>,
      },
      {
        path: "streaks",
        element: <RequireQuestionnaire><DashboardStreaks /></RequireQuestionnaire>,
      },
    ],
  },
  {
    path: "goals",
    children: [
      {
        path: "weekly",
        element: <RequireQuestionnaire><WeeklyGoals /></RequireQuestionnaire>,
      },
      {
        path: "monthly",
        element: <RequireQuestionnaire><MonthlyGoals /></RequireQuestionnaire>,
      },
    ],
  },
  {
    path: "stats/weekly-report",
    element: <RequireQuestionnaire><WeeklyReport /></RequireQuestionnaire>,
  },
  {
    path: "achievements/history",
    element: <RequireQuestionnaire><AchievementsHistory /></RequireQuestionnaire>,
  },
];
