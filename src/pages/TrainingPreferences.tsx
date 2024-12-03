import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/Layout/BottomNav";

const TrainingPreferencesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 space-y-6 pb-24">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-4 text-foreground hover:text-foreground/80"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <div>
        <h1 className="text-2xl font-bold mb-6">Préférences d'entraînement</h1>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Objectif principal</h2>
            <p className="text-muted-foreground">Perte de poids</p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Niveau d'activité</h2>
            <p className="text-muted-foreground">Intermédiaire</p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Équipement disponible</h2>
            <p className="text-muted-foreground">Haltères, tapis de yoga</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default TrainingPreferencesPage;