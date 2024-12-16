import { useState } from "react";
import { useSignIn } from "@/hooks/use-signin";
import { SignInHeader } from "./SignInForm/SignInHeader";
import { EmailInput } from "./SignInForm/EmailInput";
import { PasswordInput } from "./SignInForm/PasswordInput";
import { RememberMeCheckbox } from "./SignInForm/RememberMeCheckbox";
import { SubmitButton } from "./SignInForm/SubmitButton";
import { NavigationLinks } from "./SignInForm/NavigationLinks";
import { CardContent, CardFooter } from "@/components/ui/card";

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
        <SignInHeader />
        
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
        <NavigationLinks />
      </CardFooter>
    </form>
  );
};