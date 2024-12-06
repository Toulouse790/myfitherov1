import { Button } from "@/components/ui/button";

interface EndWorkoutButtonProps {
  workoutStarted: boolean;
  onEndWorkout: () => void;
}

export const EndWorkoutButton = ({
  workoutStarted,
  onEndWorkout
}: EndWorkoutButtonProps) => {
  if (!workoutStarted) return null;

  return (
    <div className="fixed bottom-8 right-8">
      <Button 
        variant="destructive"
        size="lg"
        onClick={onEndWorkout}
        className="shadow-lg px-6"
      >
        Terminer la séance
      </Button>
    </div>
  );
};