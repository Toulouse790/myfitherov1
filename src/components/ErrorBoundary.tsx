import { useRouteError } from "react-router-dom";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";

export const ErrorBoundary = () => {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Oops! Une erreur est survenue</h1>
        <p className="text-muted-foreground">
          {error?.statusText || error?.message || "Une erreur inattendue s'est produite"}
        </p>
        <div>
          <Button onClick={() => window.location.href = "/"}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};