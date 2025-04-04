
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface StartWorkoutButtonProps {
  onClick: () => void;
}

export const StartWorkoutButton = ({ onClick }: StartWorkoutButtonProps) => {
  return (
    <div className="flex justify-center">
      <Button 
        className="w-64 bg-gradient-to-r from-primary to-primary hover:opacity-90 transform transition-all duration-300 text-primary-foreground font-bold py-6 text-xl rounded-full shadow-lg hover:shadow-xl"
        onClick={onClick}
      >
        <Play className="mr-2 h-5 w-5" />
        C'EST PARTI !
      </Button>
    </div>
  );
};
