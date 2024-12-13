import { SignInForm } from "./SignInForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

export const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
      <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-up">
        <CardHeader className="space-y-2 text-center">
          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Dumbbell className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Bienvenue</CardTitle>
          <p className="text-sm text-muted-foreground">
            Connectez-vous pour accéder à votre espace personnel
          </p>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
};