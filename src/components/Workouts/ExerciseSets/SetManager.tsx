import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface SetManagerProps {
  onSetComplete: () => void;
}

export const SetManager = ({ onSetComplete }: SetManagerProps) => {
  const [sets, setSets] = useState<number>(3);
  const [currentSet, setCurrentSet] = useState<number>(1);

  const handleAddSet = () => {
    setSets(prev => prev + 1);
  };

  const handleRemoveSet = () => {
    if (sets > 1) {
      setSets(prev => prev - 1);
      if (currentSet > sets - 1) {
        setCurrentSet(sets - 1);
      }
    }
  };

  const handleSetComplete = () => {
    if (currentSet < sets) {
      setCurrentSet(prev => prev + 1);
    }
    onSetComplete();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-lg font-medium">
            Série {currentSet} sur {sets}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRemoveSet}
            disabled={sets <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddSet}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button 
        className="w-full"
        onClick={handleSetComplete}
        disabled={currentSet > sets}
      >
        {currentSet > sets ? "Exercice terminé" : "Valider la série"}
      </Button>
    </div>
  );
};