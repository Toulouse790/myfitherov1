
import { Header } from "@/components/Layout/Header";
import { GenerateWorkoutDialog } from "@/components/Dashboard/WorkoutSuggestions/GenerateWorkoutDialog";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { debugLogger } from "@/utils/debug-logger";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WorkoutGenerate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  
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
  }, [duration, intensity, workoutType]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        <GenerateWorkoutDialog 
          isOpen={true} 
          onClose={() => navigate('/workouts')}
          initialDuration={duration}
          initialIntensity={intensity}
          workoutType={workoutType}
        />
      </div>
    </div>
  );
}
