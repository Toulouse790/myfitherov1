import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { exerciseImages } from "@/components/Workouts/data/exerciseImages";

interface ExerciseHeaderProps {
  exerciseName: string;
  sessionId: string | undefined;
}

export const ExerciseHeader = ({ exerciseName, sessionId }: ExerciseHeaderProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isFavorite } = useFavorites(sessionId);
  const [isLocalFavorite, setIsLocalFavorite] = useState(false);

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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-medium text-muted-foreground text-center flex-1">
          {exerciseName}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className={`${isLocalFavorite ? 'text-red-500' : 'text-muted-foreground'}`}
          onClick={toggleFavorite}
        >
          <Heart className={`h-5 w-5 ${isLocalFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>
      <div className="aspect-video w-full max-w-[300px] mx-auto overflow-hidden rounded-lg bg-muted">
        <img 
          src={exerciseImages[exerciseName] || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=600&fit=crop"} 
          alt={exerciseName}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};