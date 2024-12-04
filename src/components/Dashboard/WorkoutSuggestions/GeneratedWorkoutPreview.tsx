import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WorkoutPlan } from "./workoutPlanGenerator";

interface GeneratedWorkoutPreviewProps {
  plan: WorkoutPlan;
}

export const GeneratedWorkoutPreview = ({ plan }: GeneratedWorkoutPreviewProps) => {
  const navigate = useNavigate();

  const handleStartWorkout = async () => {
    navigate(`/workouts/exercise/next-workout`);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Programme Personnalisé</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Volume total</p>
            <p className="text-lg font-medium">{plan.volume} séries</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Intensité</p>
            <p className="text-lg font-medium">{Math.round(plan.intensity * 100)}%</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Repos entre les séries</p>
            <p className="text-lg font-medium">{plan.recommendedRest}s</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Séries × Répétitions</p>
            <p className="text-lg font-medium">{plan.setsAndReps.sets} × {plan.setsAndReps.reps}</p>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleStartWorkout} 
            className="w-full py-6 text-lg"
          >
            C'EST PARTI ! 💪
          </Button>
        </div>
      </div>
    </Card>
  );
};