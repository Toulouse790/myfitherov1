import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Flame, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { RestTimer } from "./RestTimer";
import { SetHeader } from "./SetCard/SetHeader";
import { SetControls } from "./SetCard/SetControls";

interface SetCardProps {
  setId: number;
  reps: number;
  weight: number;
  completed: boolean;
  isCurrentSet: boolean;
  restTimer: number | null;
  exerciseName: string;
  onRepsChange: (setId: number, increment: boolean) => void;
  onWeightChange: (setId: number, increment: boolean) => void;
  onSetComplete: () => void;
}

export const SetCard = ({
  setId,
  reps,
  weight,
  completed,
  isCurrentSet,
  restTimer,
  exerciseName,
  onRepsChange,
  onWeightChange,
  onSetComplete,
}: SetCardProps) => {
  const [personalRecord, setPersonalRecord] = useState<number | null>(null);
  const [lastUsedWeight, setLastUsedWeight] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleComplete = async () => {
    if (!user) return;

    try {
      const { data: existingData, error: fetchError } = await supabase
        .from('user_exercise_weights')
        .select('weight, personal_record')
        .eq('user_id', user.id)
        .eq('exercise_name', exerciseName)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const isNewRecord = existingData?.personal_record ? weight > existingData.personal_record : true;
      const personalRecord = isNewRecord ? weight : existingData?.personal_record;

      const { error: upsertError } = await supabase
        .from('user_exercise_weights')
        .upsert({
          user_id: user.id,
          exercise_name: exerciseName,
          weight: weight,
          last_used_weight: weight,
          last_used_at: new Date().toISOString(),
          personal_record: personalRecord
        });

      if (upsertError) throw upsertError;

      onSetComplete();

      toast({
        title: "Série complétée !",
        description: isNewRecord 
          ? `Nouveau record personnel : ${weight}kg ! 🎉` 
          : `Série validée avec ${weight}kg`,
      });

    } catch (error) {
      console.error('Error saving weight:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le poids",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`p-4 transition-all duration-300 ${
      isCurrentSet ? 'ring-2 ring-primary' : ''
    }`}>
      <div className="space-y-4">
        <SetHeader
          setId={setId}
          personalRecord={personalRecord}
          lastUsedWeight={lastUsedWeight}
        />

        <SetControls
          weight={weight}
          reps={reps}
          onWeightChange={onWeightChange}
          onRepsChange={onRepsChange}
          setId={setId}
          completed={completed}
        />

        <RestTimer restTimer={restTimer} onRestTimeChange={() => {}} />

        <Button
          className="w-full"
          variant={completed ? "secondary" : isCurrentSet ? "default" : "secondary"}
          onClick={handleComplete}
          disabled={completed || !isCurrentSet || (restTimer !== null)}
        >
          {completed ? (
            <span className="flex items-center gap-2">
              Série complétée
              <Flame className="h-4 w-4" />
            </span>
          ) : (
            "Valider la série"
          )}
        </Button>
      </div>
    </Card>
  );
};