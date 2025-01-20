import { Card } from "@/components/ui/card";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Subscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Abonnement</h1>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="text-yellow-500" />
              <div>
                <h2 className="text-xl font-semibold">Premium</h2>
                <p className="text-sm text-muted-foreground">
                  Accédez à toutes les fonctionnalités
                </p>
              </div>
            </div>
            <Button 
              variant="default" 
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
              onClick={() => {
                toast({
                  title: "Bientôt disponible",
                  description: "L'abonnement premium sera bientôt disponible !",
                });
              }}
            >
              Passer Premium
            </Button>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="font-medium">Avantages Premium :</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Accès à tous les programmes d'entraînement</li>
              <li>• Plans nutritionnels personnalisés</li>
              <li>• Statistiques détaillées</li>
              <li>• Support prioritaire</li>
              <li>• Sans publicité</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;