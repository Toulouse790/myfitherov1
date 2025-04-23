
import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { GenerateWorkoutDialog } from "@/components/Dashboard/WorkoutSuggestions/GenerateWorkoutDialog";
import { useNavigate, useLocation } from "react-router-dom";
import { debugLogger } from "@/utils/debug-logger";

export default function WorkoutGenerate() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Récupérer les paramètres
  const state = location.state as { duration?: number; intensity?: number } | null;
  const duration = state?.duration || 45;
  const intensity = state?.intensity || 50;

  useEffect(() => {
    debugLogger.log("WorkoutGenerate", "Initialisation avec paramètres:", {
      duration,
      intensity
    });
    
    setIsInitialized(true);
  }, [duration, intensity]);

  // Retour à la page des entraînements
  const handleClose = () => {
    navigate('/workouts');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 pt-16">
        {isInitialized && (
          <GenerateWorkoutDialog 
            isOpen={true} 
            onClose={handleClose}
            initialDuration={duration}
            initialIntensity={intensity}
          />
        )}
      </div>
    </div>
  );
}
