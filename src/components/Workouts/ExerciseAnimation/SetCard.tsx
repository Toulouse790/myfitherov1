import { Button } from "@/components/ui/button";
import { Timer, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  exerciseName: string;
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
  exerciseName
}: SetCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [restTimer, setRestTimer] = useState<number | null>(null);

  const handleSetComplete = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos séries",
        variant: "destructive",
      });
      return;
    }

    // Vérifier si c'est un nouveau record
    const isNewRecord = true; // À implémenter: logique de vérification des records

    // Mettre à jour les records si nécessaire
    if (isNewRecord) {
      try {
        const { error } = await supabase
          .from('user_exercise_weights')
          .upsert({
            user_id: user.id,
            exercise_name: exerciseName,
            personal_record: weight,
            last_used_weight: weight,
            last_used_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,exercise_name'
          });

        if (error) throw error;

        toast({
          title: "Nouveau record personnel !",
          description: `Félicitations ! Vous avez établi un nouveau record à ${weight}kg.`,
        });
      } catch (error) {
        console.error('Error updating records:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le record",
          variant: "destructive",
        });
        return;
      }
    }

    onSetComplete();
  };

  return (
    <div className="space-y-4">
      {restTimer !== null ? (
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary animate-pulse">
          <Timer className="h-6 w-6" />
          <span>{restTimer}s</span>
        </div>
      ) : (
        <Button
          onClick={handleSetComplete}
          className="w-full h-12 text-lg"
          disabled={isResting}
        >
          {currentSet === 3 ? "Terminer l'exercice" : "Valider la série"}
        </Button>
      )}
    </div>
  );
};
