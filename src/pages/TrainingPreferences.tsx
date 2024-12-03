import { TrainingPreferences } from "@/components/Profile/Sections/TrainingPreferences";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      
      <h1 className="text-2xl font-bold">Préférences d'entraînement</h1>
      <TrainingPreferences />
    </div>
  );
};

export default TrainingPreferencesPage;