import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { SetControls } from "./SetControls";
import { SetStatus } from "./SetStatus";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [formRating, setFormRating] = useState(5);
  const [rpe, setRpe] = useState(7);
  const [setType, setSetType] = useState<'normal' | 'warmup' | 'dropset' | 'superset'>('normal');
  const [failureReps, setFailureReps] = useState(false);
  const [tempo, setTempo] = useState({ eccentric: 2, concentric: 1, pause: 0 });
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

      // Sauvegarder les détails de la série avec les nouvelles données
      const { error: setError } = await supabase
        .from('exercise_sets')
        .insert({
          exercise_name: exerciseName,
          set_number: index + 1,
          reps: reps,
          weight: weight,
          form_rating: formRating,
          rpe: rpe,
          set_type: setType,
          failure_reps: failureReps,
          tempo_seconds: tempo,
          target_muscle_activation: [exerciseName.split('_')[0]]
        });

      if (setError) throw setError;

      setIsCompleted(true);
      onSetComplete();

      toast({
        title: "Série complétée !",
        description: isNewRecord 
          ? `Nouveau record personnel : ${weight}kg ! 🎉` 
          : `Série validée avec ${weight}kg. Repos de 90 secondes.`,
      });

    } catch (error) {
      console.error('Error saving set:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la série",
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
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de série</label>
              <Select value={setType} onValueChange={(value: any) => setSetType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de série" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="warmup">Échauffement</SelectItem>
                  <SelectItem value="dropset">Drop Set</SelectItem>
                  <SelectItem value="superset">Super Set</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Qualité d'exécution (1-5)</label>
              <Slider
                value={[formRating]}
                min={1}
                max={5}
                step={1}
                onValueChange={(value) => setFormRating(value[0])}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">RPE (1-10)</label>
              <Slider
                value={[rpe]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setRpe(value[0])}
              />
            </div>

            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setFailureReps(!failureReps)}
            >
              {failureReps ? "Échec musculaire ✓" : "Marquer comme échec musculaire"}
            </Button>

            <Button 
              onClick={handleComplete}
              className="w-full"
            >
              Valider la série
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};