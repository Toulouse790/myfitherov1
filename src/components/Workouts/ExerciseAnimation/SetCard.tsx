import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { SetControls } from "./SetControls";
import { SetStatus } from "./SetStatus";

interface SetCardProps {
  index: number;
  currentSet: number;
  isResting: boolean;
  reps: number;
  weight: number;
  exerciseName: string;
  onRepsChange: (value: number) => void;
  onWeightChange: (value: number) => void;
  onSetComplete: () => void;
}

export const SetCard = ({
  index,
  currentSet,
  isResting,
  reps,
  weight,
  exerciseName,
  onRepsChange,
  onWeightChange,
  onSetComplete,
}: SetCardProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const isActive = index === currentSet - 1;

  const handleComplete = async () => {
    if (!user) return;

    try {
      // Vérifier si c'est un record personnel
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

      // Mettre à jour le poids et le record personnel
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

      setIsCompleted(true);
      onSetComplete();

      toast({
        title: "Série complétée !",
        description: isNewRecord 
          ? `Nouveau record personnel : ${weight}kg ! 🎉` 
          : `Série validée avec ${weight}kg. Repos de 90 secondes.`,
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
      isActive ? 'ring-2 ring-primary' : ''
    } ${isCompleted ? 'bg-muted/50' : ''}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Série {index + 1}</span>
          <SetStatus 
            isCompleted={isCompleted}
            isResting={isResting}
            restTime={isResting ? 90 : null}
          />
        </div>

        <SetControls
          weight={weight}
          reps={reps}
          onWeightChange={onWeightChange}
          onRepsChange={onRepsChange}
          disabled={!isActive || isCompleted || isResting}
        />

        {isActive && !isCompleted && !isResting && (
          <Button 
            onClick={handleComplete}
            className="w-full mt-4"
          >
            Valider la série
          </Button>
        )}
      </div>
    </Card>
  );
};