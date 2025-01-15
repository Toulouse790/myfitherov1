import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface ExerciseCardProps {
  exerciseName: string;
  weight: number;
  reps: number;
  completedSets: number;
  restTimer: number | null;
  onWeightChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onSetComplete: (difficulty: string, notes: string) => void;
  isTransitioning: boolean;
  sessionId: string | null;
}

export const ExerciseCard = ({
  exerciseName,
  weight,
  reps,
  completedSets,
  restTimer,
  onWeightChange,
  onRepsChange,
  onSetComplete,
  isTransitioning,
  sessionId
}: ExerciseCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !sessionId) return;

      try {
        const { data, error } = await supabase
          .from('favorite_workouts')
          .select('id')
          .eq('user_id', user.id)
          .eq('session_id', sessionId)
          .maybeSingle();

        if (error) {
          console.error('Error checking favorite status:', error);
          return;
        }

        setIsFavorite(!!data);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [sessionId, user]);

  const toggleFavorite = async () => {
    if (!user || !sessionId) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter aux favoris",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorite_workouts')
          .delete()
          .eq('user_id', user.id)
          .eq('session_id', sessionId);

        if (error) throw error;

        toast({
          title: "Retiré des favoris",
          description: "La séance a été retirée de vos favoris"
        });
      } else {
        const { error } = await supabase
          .from('favorite_workouts')
          .insert({
            user_id: user.id,
            session_id: sessionId
          });

        if (error) throw error;

        toast({
          title: "Ajouté aux favoris",
          description: "La séance a été ajoutée à vos favoris"
        });
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{exerciseName}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFavorite}
          className={isFavorite ? "text-red-500" : "text-gray-400"}
        >
          <Heart className={isFavorite ? "fill-current" : ""} />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">Poids (kg)</label>
          <Input
            type="number"
            value={weight}
            onChange={(e) => onWeightChange(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Répétitions</label>
          <Input
            type="number"
            value={reps}
            onChange={(e) => onRepsChange(Number(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => onSetComplete('moderate', '')}
          disabled={restTimer !== null || isTransitioning}
          variant={completedSets > 0 ? "default" : "outline"}
          className="w-full"
        >
          {completedSets > 0 ? (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              <span>Série {completedSets} complétée</span>
            </div>
          ) : (
            "Valider la série"
          )}
        </Button>
      </div>
    </Card>
  );
};