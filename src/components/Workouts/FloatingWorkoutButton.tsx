import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

interface FloatingWorkoutButtonProps {
  selectedCount: number;
  onClick: () => void;
}

export const FloatingWorkoutButton = ({ selectedCount, onClick }: FloatingWorkoutButtonProps) => {
  if (selectedCount === 0) return null;

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 shadow-lg rounded-full px-6 py-6 bg-primary hover:bg-primary/90"
    >
      <Dumbbell className="h-5 w-5 mr-2" />
      Voir ma séance ({selectedCount})
    </Button>
  );
};