import { useState } from "react";
import { Card } from "@/components/ui/card";
import { WeightInput } from "./ExerciseCard/WeightInput";
import { RepsInput } from "./ExerciseCard/RepsInput";
import { RestTimer } from "../ExerciseAnimation/RestTimer";
import { exerciseImages } from "../data/exerciseImages";
import { Button } from "@/components/ui/button";
import { Timer, Check, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";

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
}

const getRepsLabel = (exerciseName: string): string => {
  const lowerName = exerciseName.toLowerCase();
  
  if (lowerName.includes("biceps") || lowerName.includes("triceps") || lowerName.includes("curl")) {
    return "RÉPÉTITIONS PAR BRAS";
  }
  
  if (lowerName.includes("jambe") || lowerName.includes("fente") || lowerName.includes("mollet")) {
    return "RÉPÉTITIONS PAR JAMBE";
  }
  
  return "RÉPÉTITIONS";
};

export const ExerciseCard = ({ 
  exerciseName,
  weight,
  reps,
  completedSets,
  restTimer,
  onWeightChange,
  onRepsChange,
  onSetComplete,
  isTransitioning
}: ExerciseCardProps) => {
  const [isResting, setIsResting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const sessionId = window.location.pathname.split('/').pop();
  const { isFavorite } = useFavorites(sessionId);
  const [isLocalFavorite, setIsLocalFavorite] = useState(false);

  const handleSetComplete = () => {
    setIsResting(true);
    onSetComplete("moderate", "");
  };

  const handleRestComplete = () => {
    setIsResting(false);
  };

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
      if (!isLocalFavorite) {
        await supabase
          .from('favorite_workouts')
          .insert([{ user_id: user.id, session_id: sessionId }]);
        toast({
          title: "Ajouté aux favoris",
          description: "L'exercice a été ajouté à vos favoris",
        });
      } else {
        await supabase
          .from('favorite_workouts')
          .delete()
          .eq('user_id', user.id)
          .eq('session_id', sessionId);
        toast({
          title: "Retiré des favoris",
          description: "L'exercice a été retiré de vos favoris",
        });
      }
      setIsLocalFavorite(!isLocalFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier les favoris",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-medium text-muted-foreground text-center flex-1">{exerciseName}</h3>
          <Button
            variant="ghost"
            size="sm"
            className={`${isLocalFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isLocalFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <img 
            src={exerciseImages[exerciseName] || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop"} 
            alt={exerciseName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {restTimer !== null && completedSets > 0 && (
        <div className="py-2">
          <RestTimer 
            restTime={restTimer} 
            onRestTimeChange={() => {}} 
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-4 px-3">
          <div className="flex-1 text-xs text-muted-foreground text-center">KG</div>
          <div className="flex-1 text-xs text-muted-foreground text-center">{getRepsLabel(exerciseName)}</div>
          <div className="w-[72px]"></div>
        </div>
        {[1, 2, 3].map((setNumber) => (
          <div 
            key={setNumber} 
            className={`p-3 rounded-lg ${
              completedSets >= setNumber ? 'bg-muted/50' : 'bg-card'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`text-[11px] min-w-[40px] text-center ${
                  completedSets >= setNumber 
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-700' 
                    : 'text-muted-foreground hover:bg-primary/10'
                }`}
                onClick={handleSetComplete}
                disabled={completedSets + 1 !== setNumber || isResting}
              >
                {completedSets >= setNumber ? (
                  <Check className="h-4 w-4" />
                ) : (
                  `S${setNumber}`
                )}
              </Button>
              <div className="flex flex-1 items-center justify-center gap-2">
                <WeightInput 
                  weight={weight} 
                  onWeightChange={onWeightChange}
                  onComplete={handleSetComplete}
                  disabled={completedSets >= setNumber}
                />
                <RepsInput 
                  reps={reps} 
                  onRepsChange={onRepsChange}
                  disabled={completedSets >= setNumber}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};