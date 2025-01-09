import { useRouteError } from "react-router-dom";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";
import { Card } from "./ui/card";

export const ErrorBoundary = () => {
  const error = useRouteError() as any;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {error?.status === 404 ? "Page introuvable" : "Une erreur est survenue"}
            </h1>
            
            <p className="text-muted-foreground">
              {error?.status === 404 
                ? "La page que vous recherchez n'existe pas ou a été déplacée."
                : error?.statusText || error?.message || "Une erreur inattendue s'est produite"}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
            >
              Retour
            </Button>
            <Button onClick={() => window.location.href = "/"}>
              Accueil
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};