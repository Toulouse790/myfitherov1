
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";
import { AuthConfirmPage } from "@/pages/AuthConfirm";

export const authRoutes = [
  {
    path: "signin",
    element: <SignInPage />,
  },
  {
    path: "signup",
    element: <SignUpPage />,
  },
  {
    path: "confirm",
    element: <AuthConfirmPage />,
  }
];
