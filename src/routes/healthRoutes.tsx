
import { lazy } from "react";

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
