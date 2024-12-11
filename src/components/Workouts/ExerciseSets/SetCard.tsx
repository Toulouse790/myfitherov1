import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ChevronUp, ChevronDown, Flame, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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
  exerciseName: string;
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
  onRepsChange,
  exerciseName
}: SetCardProps) => {
  const [personalRecord, setPersonalRecord] = useState<number | null>(null);
  const [lastUsedWeight, setLastUsedWeight] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchWeightData = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('user_exercise_weights')
        .select('personal_record, last_used_weight')
        .eq('user_id', user.id)
        .eq('exercise_name', exerciseName)
        .single();

      if (error) {
        console.error('Error fetching weight data:', error);
        return;
      }

      if (data) {
        setPersonalRecord(data.personal_record);
        setLastUsedWeight(data.last_used_weight);
      }
    };

    fetchWeightData();
  }, [user, exerciseName]);

  const isNewRecord = weight > (personalRecord || 0);

  const handleSetCompleted = async () => {
    if (!user) return;

    // Mettre à jour les records si nécessaire
    if (isNewRecord) {
      const { error } = await supabase
        .from('user_exercise_weights')
        .upsert({
          user_id: user.id,
          exercise_name: exerciseName,
          personal_record: weight,
          last_used_weight: weight,
          last_used_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('exercise_name', exerciseName);

      if (error) {
        console.error('Error updating records:', error);
        return;
      }

      toast({
        title: "Nouveau record personnel !",
        description: `Félicitations ! Vous avez établi un nouveau record à ${weight}kg.`,
      });
    }

    onComplete(setId);
  };

  return (
    <Card className={`p-4 transition-all duration-300 ${
      isCurrentSet ? 'ring-2 ring-primary' : ''
    }`}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Série {setId}</span>
          <div className="flex gap-2">
            {personalRecord && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {personalRecord}kg
              </Badge>
            )}
            {lastUsedWeight && (
              <Badge variant="outline" className="flex items-center gap-1">
                <ChevronUp className="w-3 h-3" />
                {lastUsedWeight}kg
              </Badge>
            )}
          </div>
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
          variant={completed ? "secondary" : isNewRecord ? "default" : "secondary"}
          onClick={handleSetCompleted}
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
          ) : isNewRecord ? (
            <span className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Nouveau Record !
            </span>
          ) : (
            "Valider la série"
          )}
        </Button>
      </div>
    </Card>
  );
};