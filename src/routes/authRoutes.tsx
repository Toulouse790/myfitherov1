
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";

export const authRoutes = [
  {
    path: "signin",
    element: <SignInPage />,
  },
  {
    path: "signup",
    element: <SignUpPage />,
  }
];
