import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";

interface SetButtonProps {
  isResting: boolean;
  currentSet: number;
  maxSets: number;
  onComplete: () => void;
  restTime: number;
}

export const SetButton = ({ 
  isResting, 
  currentSet, 
  maxSets, 
  onComplete, 
  restTime 
}: SetButtonProps) => {
  return (
    <Button 
      className="w-full h-12 text-lg"
      onClick={onComplete}
      disabled={isResting || currentSet > maxSets}
    >
      {isResting ? (
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <span>Repos: {restTime}s</span>
        </div>
      ) : currentSet > maxSets ? (
        "Exercice terminé"
      ) : (
        "Valider la série"
      )}
    </Button>
  );
};