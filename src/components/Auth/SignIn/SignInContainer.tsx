
import { SignInForm } from "./SignInForm";
import { useSignIn } from "@/hooks/use-signin";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { debugLogger } from "@/utils/debug-logger";

export const SignInContainer = () => {
  const { handleSignIn, isLoading } = useSignIn();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const from = (location.state as any)?.from || "/";

  useEffect(() => {
    if (user) {
      debugLogger.log("SignIn", "Utilisateur déjà connecté, redirection vers", from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />;
};
