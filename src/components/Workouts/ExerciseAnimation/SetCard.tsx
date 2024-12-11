import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Timer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

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
      // 1. D'abord, récupérer le poids existant
      const { data: existingData, error: fetchError } = await supabase
        .from('user_exercise_weights')
        .select('weight, personal_record')
        .eq('user_id', user.id)
        .eq('exercise_name', exerciseName)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // 2. Déterminer si c'est un nouveau record personnel
      const isNewRecord = existingData?.personal_record ? weight > existingData.personal_record : true;
      const personalRecord = isNewRecord ? weight : existingData?.personal_record;

      // 3. Mettre à jour ou insérer les données
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

      // 4. Marquer la série comme complétée
      setIsCompleted(true);
      onSetComplete();

      // 5. Afficher un message approprié
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
    <Card className={`p-4 ${isActive ? 'border-primary' : ''} ${isCompleted ? 'bg-muted' : ''}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Série {index + 1}</span>
          {isCompleted && <Check className="w-4 h-4 text-green-500" />}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={reps}
              onChange={(e) => onRepsChange(Number(e.target.value))}
              className="w-20"
              disabled={!isActive || isCompleted || isResting}
            />
            <span className="text-sm text-muted-foreground">reps</span>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={weight}
              onChange={(e) => onWeightChange(Number(e.target.value))}
              className="w-20"
              disabled={!isActive || isCompleted || isResting}
            />
            <span className="text-sm text-muted-foreground">kg</span>
          </div>

          {isActive && !isCompleted && !isResting && (
            <Button onClick={handleComplete}>
              Valider
            </Button>
          )}

          {isActive && isResting && (
            <div className="flex items-center gap-2 text-primary">
              <Timer className="w-4 h-4" />
              <span>Repos</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};