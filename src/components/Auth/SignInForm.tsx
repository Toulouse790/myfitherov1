import { useState } from "react";
import { useSignIn } from "@/hooks/use-signin";
import { EmailInput } from "./SignInForm/EmailInput";
import { PasswordInput } from "./SignInForm/PasswordInput";
import { RememberMeCheckbox } from "./SignInForm/RememberMeCheckbox";
import { SubmitButton } from "./SignInForm/SubmitButton";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { handleSignIn, isLoading } = useSignIn();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignIn(email, password, rememberMe);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <CardContent className="space-y-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Connexion
          </h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour accéder à votre compte
          </p>
          <p className="text-sm">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
        
        <div className="space-y-4">
          <EmailInput
            email={email}
            onChange={setEmail}
          />
          
          <PasswordInput
            password={password}
            onChange={setPassword}
          />
          
          <RememberMeCheckbox
            checked={rememberMe}
            onCheckedChange={setRememberMe}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <SubmitButton isLoading={isLoading} />
      </CardFooter>
    </form>
  );
};