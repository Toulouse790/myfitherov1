
import { lazy } from "react";
import { AuthConfirmPage } from "@/pages/AuthConfirm";
import { QuestionnaireCompleteHandler } from "@/components/Profile/QuestionnaireCompleteHandler";

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
