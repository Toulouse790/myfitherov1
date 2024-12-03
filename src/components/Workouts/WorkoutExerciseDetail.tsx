import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ExerciseSets } from "./ExerciseSets";

interface WorkoutExerciseDetailProps {
  onBack: () => void;
}

export const WorkoutExerciseDetail = ({ onBack }: WorkoutExerciseDetailProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <ExerciseSets exerciseName="Rowing avec Haltères" />
      </div>
    </div>
  );
};