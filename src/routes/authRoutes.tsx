import { lazy } from "react";
import { AuthConfirmPage } from "@/pages/AuthConfirm";
import { QuestionnaireCompleteHandler } from "@/components/Profile/QuestionnaireCompleteHandler";
import { withSuspense } from "@/utils/route-utils";

const SignInPage = lazy(() => import("@/pages/SignIn"));
const SignUpPage = lazy(() => import("@/pages/SignUp"));

export const authRoutes = [
  {
    path: "/signin",
    element: withSuspense(SignInPage),
  },
  {
    path: "/signup",
    element: withSuspense(SignUpPage),
  },
  {
    path: "/auth/confirm",
    element: <AuthConfirmPage />,
  },
  {
    path: "/questionnaire-complete",
    element: <QuestionnaireCompleteHandler />,
  },
];
