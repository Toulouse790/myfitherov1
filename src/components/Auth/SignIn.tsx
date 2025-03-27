
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SignInForm } from "./SignInForm";
import { SignInHeader } from "./SignInHeader";
import { ConnexionTest } from "@/components/Admin/ConnexionTest";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { debugLogger } from "@/utils/debug-logger";

export const SignIn = () => {
  const [showConnectionTest, setShowConnectionTest] = useState(false);
  
  const toggleDebugMode = () => {
    debugLogger.enableDebugMode();
    setShowConnectionTest(true);
  };

  return (
    <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border-blue-200 dark:border-blue-800 bg-gradient-to-b from-white to-blue-50 dark:from-blue-950 dark:to-gray-900">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Se connecter</CardTitle>
          <CardDescription className="text-center">
            Entrez vos identifiants pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <SignInForm />
      </Card>
      
      {showConnectionTest ? (
        <div className="mt-8 w-full max-w-md">
          <ConnexionTest />
        </div>
      ) : (
        <div className="mt-4">
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs text-muted-foreground"
            onClick={toggleDebugMode}
          >
            Version 1.1.2
          </Button>
        </div>
      )}
    </div>
  );
};
