import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface StartWorkoutButtonProps {
  onStart: () => void;
}

export const StartWorkoutButton = ({ onStart }: StartWorkoutButtonProps) => {
  return (
    <Button 
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
      onClick={onStart}
    >
      <Play className="w-5 h-5 mr-2" />
      GO
    </Button>
  );
};