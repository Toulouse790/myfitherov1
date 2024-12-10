import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

export const NoSessionView = () => {
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="p-6">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Démarrer un test</h2>
          <p className="text-muted-foreground">
            Cliquez sur le bouton ci-dessous pour commencer une session de test
          </p>
          <Button 
            size="lg"
            className="w-full sm:w-auto"
          >
            <Timer className="w-5 h-5 mr-2" />
            Commencer le test
          </Button>
        </div>
      </Card>
    </div>
  );
};