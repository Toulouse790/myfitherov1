import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WorkoutHeader = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Prochain Entraînement (IA)
        </h1>
        <p className="text-muted-foreground mt-2">
          Dos, Biceps, Épaules
        </p>
      </div>
    </>
  );
};