import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import Index from "@/pages/Index";
import WorkoutSession from "@/pages/WorkoutSession";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/workout-session",
        element: <WorkoutSession />,
      },
    ],
  },
]);
