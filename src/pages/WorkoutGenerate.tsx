
import { Header } from "@/components/Layout/Header";
import { GenerateWorkoutDialog } from "@/components/Dashboard/WorkoutSuggestions/GenerateWorkoutDialog";
import { useNavigate, useLocation } from "react-router-dom";

export default function WorkoutGenerate() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer les paramètres transmis via navigation
  const state = location.state as { duration?: number; intensity?: number } | null;
  const duration = state?.duration || 45;
  const intensity = state?.intensity || 50;

  console.log("WorkoutGenerate - duration:", duration);
  console.log("WorkoutGenerate - intensity:", intensity);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        <GenerateWorkoutDialog 
          isOpen={true} 
          onClose={() => navigate('/')}
          initialDuration={duration}
        />
      </div>
    </div>
  );
}
