import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ChevronUp, ChevronDown, Flame } from "lucide-react";

interface SetCardProps {
  setId: number;
  reps: number;
  weight: number;
  completed: boolean;
  calories?: number;
  isCurrentSet: boolean;
  restTimer: number | null;
  onComplete: (setId: number) => void;
  onWeightChange: (setId: number, increment: boolean) => void;
  onRepsChange: (setId: number, increment: boolean) => void;
}

export const SetCard = ({
  setId,
  reps,
  weight,
  completed,
  calories,
  isCurrentSet,
  restTimer,
  onComplete,
  onWeightChange,
  onRepsChange
}: SetCardProps) => {
  return (
    <Card className={`p-4 transition-all duration-300 ${
      isCurrentSet ? 'ring-2 ring-primary' : ''
    }`}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Série {setId}</span>
          {completed && (
            <div className="flex items-center gap-2 text-green-500">
              <Check className="h-4 w-4" />
              <span className="text-sm">Complétée</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Poids (kg)</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onWeightChange(setId, false)}
                disabled={completed}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{weight}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onWeightChange(setId, true)}
                disabled={completed}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Répétitions</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onRepsChange(setId, false)}
                disabled={completed}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{reps}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onRepsChange(setId, true)}
                disabled={completed}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          variant={completed ? "secondary" : "default"}
          onClick={() => onComplete(setId)}
          disabled={completed || !isCurrentSet || (restTimer !== null)}
        >
          {completed ? (
            <span className="flex items-center gap-2">
              Série complétée
              {calories && (
                <>
                  <Flame className="h-4 w-4" />
                  <span>{calories} kcal</span>
                </>
              )}
            </span>
          ) : (
            "Valider la série"
          )}
        </Button>
      </div>
    </Card>
  );
};