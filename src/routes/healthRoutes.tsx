import { lazy } from "react";
import { withSuspense } from "@/utils/route-utils";

const Nutrition = lazy(() => import("@/pages/Nutrition"));
const Sleep = lazy(() => import("@/pages/Sleep"));
const Stats = lazy(() => import("@/pages/Stats"));
const Cardio = lazy(() => import("@/pages/Cardio"));

export const healthRoutes = [
  {
    path: "nutrition",
    element: withSuspense(Nutrition)
  },
  {
    path: "sleep",
    element: withSuspense(Sleep)
  },
  {
    path: "stats",
    element: withSuspense(Stats)
  },
  {
    path: "cardio",
    element: withSuspense(Cardio)
  }
];
