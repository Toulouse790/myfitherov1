
import { useState, useEffect } from "react";
import { Header } from "@/components/Layout/Header";
import { GenerateWorkoutDialog } from "@/components/Dashboard/WorkoutSuggestions/GenerateWorkoutDialog";
import { useNavigate, useLocation } from "react-router-dom";
import { debugLogger } from "@/utils/debug-logger";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export default function WorkoutGenerate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Récupérer les paramètres transmis via navigation
  const state = location.state as { duration?: number; intensity?: number; workoutType?: string } | null;
  const duration = state?.duration || 45;
  const intensity = state?.intensity || 50;
  const workoutType = state?.workoutType || '';

  useEffect(() => {
    debugLogger.log("WorkoutGenerate", "Paramètres reçus:", {
      duration,
      intensity,
      workoutType
    });
    
    // Marquer que l'initialisation est terminée
    setIsInitialized(true);
    
    // Si nous n'avons pas de paramètres d'état, afficher un message
    if (!state) {
      toast({
        title: t("workouts.generateSession") || "Générer une séance",
        description: t("workouts.generatorDescription") || "Créez un entraînement personnalisé basé sur vos préférences"
      });
    }
  }, [duration, intensity, workoutType, toast, t, state]);

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
            workoutType={workoutType}
          />
        )}
      </div>
    </div>
  );
}
