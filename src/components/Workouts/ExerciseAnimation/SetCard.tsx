import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export interface SetCardProps {
  index: number;
  currentSet: number;
  isResting: boolean;
  reps: number;
  weight: number;
  exerciseName: string;
  onRepsChange: (value: number) => void;
  onWeightChange: Dispatch<SetStateAction<number>>;
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
  const { toast } = useToast();
  const { user } = useAuth();

  const handleComplete = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_exercise_weights')
        .upsert({
          user_id: user.id,
          exercise_name: exerciseName,
          weight: weight,
          last_used_weight: weight,
          last_used_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,exercise_name'
        });

      if (error) throw error;

      setIsCompleted(true);
      onSetComplete();
    } catch (error) {
      console.error('Error saving weight:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le poids",
        variant: "destructive",
      });
    }
  };

  const handleWeightChange = (adjustment: number) => {
    onWeightChange(prev => Math.max(0, prev + adjustment));
  };

  const handleRepsChange = (adjustment: number) => {
    onRepsChange(Math.max(1, reps + adjustment));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-lg border ${
        isCompleted ? 'bg-muted/20' : index + 1 === currentSet ? 'border-primary' : ''
      }`}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Poids (kg)</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleWeightChange(-2.5)}
                disabled={isCompleted || isResting}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={weight}
                onChange={(e) => onWeightChange(Number(e.target.value))}
                className="text-center"
                disabled={isCompleted || isResting}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleWeightChange(2.5)}
                disabled={isCompleted || isResting}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Répétitions</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRepsChange(-1)}
                disabled={isCompleted || isResting}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={reps}
                onChange={(e) => onRepsChange(Number(e.target.value))}
                className="text-center"
                disabled={isCompleted || isResting}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRepsChange(1)}
                disabled={isCompleted || isResting}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button
          onClick={handleComplete}
          className="w-full"
          disabled={isCompleted || isResting || index + 1 !== currentSet}
        >
          {isCompleted ? (
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Série complétée</span>
            </div>
          ) : (
            "Valider la série"
          )}
        </Button>
      </div>
    </motion.div>
  );
};