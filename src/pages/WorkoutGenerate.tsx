import { Header } from "@/components/Layout/Header";
import { GenerateWorkoutDialog } from "@/components/Dashboard/WorkoutSuggestions/GenerateWorkout/GenerateWorkoutDialog";
import { useNavigate } from "react-router-dom";

export default function WorkoutGenerate() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        <GenerateWorkoutDialog 
          isOpen={true} 
          onClose={() => navigate('/')}
        />
      </div>
    </div>
  );
}