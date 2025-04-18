
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";

interface FinishWorkoutButtonProps {
  onCompleteWorkout: () => void;
}

export const FinishWorkoutButton = ({ onCompleteWorkout }: FinishWorkoutButtonProps) => {
  return (
    <Button
      className="w-full"
      size="lg"
      onClick={onCompleteWorkout}
    >
      <CheckSquare className="mr-2 h-5 w-5" />
      Terminer l'entraînement
    </Button>
  );
};
