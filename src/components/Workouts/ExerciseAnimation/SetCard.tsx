import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface SetCardProps {
  index: number;
  currentSet: number;
  isResting: boolean;
  reps: number;
  weight: number;
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
  onRepsChange,
  onWeightChange,
  onSetComplete,
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
  }, [user]);

  const isNewRecord = weight > (personalRecord || 0);
  const isActive = currentSet === index + 1;

  const handleSetCompleted = async () => {
    if (!user) return;

    // Mettre à jour les records si nécessaire
    if (isNewRecord) {
      const { error } = await supabase
        .from('user_exercise_weights')
        .update({
          personal_record: weight,
          last_used_weight: weight,
          last_used_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating records:', error);
        return;
      }

      toast({
        title: "Nouveau record personnel !",
        description: `Félicitations ! Vous avez établi un nouveau record à ${weight}kg.`,
      });
    }

    onSetComplete();
  };

  return (
    <div className={`p-4 rounded-lg border transition-all ${
      isActive ? 'border-primary bg-primary/5' : 'border-muted'
    }`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Série {index + 1}</span>
          <div className="flex gap-2">
            {personalRecord && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {personalRecord}kg
              </Badge>
            )}
            {lastUsedWeight && (
              <Badge variant="outline" className="flex items-center gap-1">
                <History className="w-3 h-3" />
                {lastUsedWeight}kg
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Poids (kg)</label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => onWeightChange(Number(e.target.value))}
              disabled={!isActive || isResting}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Répétitions</label>
            <Input
              type="number"
              value={reps}
              onChange={(e) => onRepsChange(Number(e.target.value))}
              disabled={!isActive || isResting}
              className="mt-1"
            />
          </div>
        </div>

        {isActive && !isResting && (
          <Button 
            onClick={handleSetCompleted}
            className="w-full"
            variant={isNewRecord ? "default" : "secondary"}
          >
            {isNewRecord && <TrendingUp className="w-4 h-4 mr-2" />}
            Valider la série
          </Button>
        )}
      </div>
    </div>
  );
};