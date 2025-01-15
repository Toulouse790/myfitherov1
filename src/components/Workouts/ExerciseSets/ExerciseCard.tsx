import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeightInput } from "./ExerciseCard/WeightInput";
import { RepsInput } from "./ExerciseCard/RepsInput";
import { RestTimer } from "../ExerciseAnimation/RestTimer";
import { exerciseImages } from "../data/exerciseImages";
import { Check, Heart, Plus } from "lucide-react";
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
  const [totalSets, setTotalSets] = useState(3);
  const [setWeights, setSetWeights] = useState<{ [key: number]: number }>({});

  const handleSetComplete = () => {
    setIsResting(true);
    onSetComplete("moderate", "");
  };

  const handleRestComplete = () => {
    setIsResting(false);
  };

  const handleWeightChange = (value: number, setNumber: number) => {
    if (setNumber < completedSets) {
      return; // Ne pas permettre la modification des séries complétées
    }
    
    const newSetWeights = { ...setWeights };
    for (let i = setNumber; i < totalSets; i++) {
      if (i >= completedSets) {
        newSetWeights[i] = value;
      }
    }
    setSetWeights(newSetWeights);
    onWeightChange(value);
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
        const { error } = await supabase
          .from('favorite_workouts')
          .insert([{ user_id: user.id, session_id: sessionId }]);
          
        if (error) throw error;
        
        toast({
          title: "Ajouté aux favoris",
          description: "L'exercice a été ajouté à vos favoris",
        });
      } else {
        const { error } = await supabase
          .from('favorite_workouts')
          .delete()
          .eq('user_id', user.id)
          .eq('session_id', sessionId);
          
        if (error) throw error;
        
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

  const handleAddSet = () => {
    setTotalSets(prev => prev + 1);
    toast({
      title: "Série ajoutée",
      description: `Une nouvelle série a été ajoutée à ${exerciseName}`,
    });
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
        {Array.from({ length: totalSets }).map((_, setNumber) => (
          <div 
            key={setNumber} 
            className={`p-3 rounded-lg ${
              completedSets >= setNumber + 1 ? 'bg-muted/50' : 'bg-card'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`text-[11px] min-w-[40px] text-center ${
                  completedSets >= setNumber + 1 
                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-700' 
                    : 'text-muted-foreground hover:bg-primary/10'
                }`}
                onClick={handleSetComplete}
                disabled={completedSets + 1 !== setNumber + 1 || isResting}
              >
                {completedSets >= setNumber + 1 ? (
                  <Check className="h-4 w-4" />
                ) : (
                  `S${setNumber + 1}`
                )}
              </Button>
              <div className="flex flex-1 items-center justify-center gap-2">
                <WeightInput 
                  weight={setWeights[setNumber] || weight} 
                  onWeightChange={(value) => handleWeightChange(value, setNumber)}
                  disabled={completedSets >= setNumber + 1}
                />
                <RepsInput 
                  reps={reps} 
                  onRepsChange={onRepsChange}
                  disabled={completedSets >= setNumber + 1}
                />
              </div>
            </div>
          </div>
        ))}
        {totalSets === 3 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 gap-2"
            onClick={handleAddSet}
          >
            <Plus className="h-4 w-4" />
            Ajouter une série
          </Button>
        )}
      </div>
    </div>
  );
};