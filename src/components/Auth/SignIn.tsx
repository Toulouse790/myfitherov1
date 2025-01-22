import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SignInForm } from "./SignInForm";

export const SignIn = () => {
  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Se connecter</CardTitle>
        </CardHeader>
        <SignInForm />
      </Card>
    </div>
  );
};