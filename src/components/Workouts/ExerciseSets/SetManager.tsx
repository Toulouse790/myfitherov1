import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { RestTimer } from "./RestTimer";

interface SetManagerProps {
  onSetComplete: () => void;
}

export const SetManager = ({ onSetComplete }: SetManagerProps) => {
  const [sets, setSets] = useState<number>(3);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [restTimer, setRestTimer] = useState<number | null>(null);

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
      setRestTimer(90); // Démarrer le minuteur de repos
    }
    onSetComplete();
  };

  const handleRestTimeChange = (adjustment: number) => {
    setRestTimer(prev => prev !== null ? Math.max(15, Math.min(180, prev + adjustment)) : null);
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

      <RestTimer 
        restTimer={restTimer}
        onRestTimeChange={handleRestTimeChange}
      />

      {restTimer === null && (
        <Button 
          className="w-full"
          onClick={handleSetComplete}
          disabled={currentSet > sets}
        >
          {currentSet > sets ? "Exercice terminé" : "Valider la série"}
        </Button>
      )}
    </div>
  );
};