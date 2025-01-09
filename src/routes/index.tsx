import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/Layout/RootLayout";
import { Home } from "@/pages/Home";
import { SignIn } from "@/components/Auth/SignIn";
import { SignUp } from "@/components/Auth/SignUp";
import { InitialQuestionnaire } from "@/components/Profile/InitialQuestionnaire";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "initial-questionnaire",
        element: (
          <ProtectedRoute>
            <InitialQuestionnaire />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);