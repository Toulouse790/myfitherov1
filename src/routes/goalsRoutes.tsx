
import { lazy } from "react";
import { withSuspense } from "@/utils/route-utils";

const Weekly = lazy(() => import("@/pages/Goals/Weekly"));
const Monthly = lazy(() => import("@/pages/Goals/Monthly"));

export const goalsRoutes = [
  {
    path: "goals/weekly",
    element: withSuspense(Weekly)
  },
  {
    path: "goals/monthly",
    element: withSuspense(Monthly)
  }
];
