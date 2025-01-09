import { Header } from "@/components/Layout/Header";
import { GenerateWorkoutDialog } from "@/components/Dashboard/WorkoutSuggestions/GenerateWorkoutDialog";
import { useNavigate } from "react-router-dom";
import { WorkoutPlan } from "@/components/Dashboard/WorkoutSuggestions/workoutPlanGenerator";

export default function WorkoutGenerate() {
  const navigate = useNavigate();

  const handleWorkoutGenerated = (workout: WorkoutPlan) => {
    console.log("Séance générée avec succès:", workout);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        <GenerateWorkoutDialog 
          open={true} 
          onOpenChange={(open) => {
            if (!open) {
              navigate('/');
            }
          }}
          onWorkoutGenerated={handleWorkoutGenerated}
        />
      </div>
    </div>
  );
}