import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface WorkoutCardProps {
  title: string;
  description: string;
  sessionId?: string;
  onSelect?: () => void;
}

export const WorkoutCard = ({ 
  title, 
  description, 
  sessionId,
  onSelect 
}: WorkoutCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user && sessionId) {
      checkIfFavorite();
    }
  }, [user, sessionId]);

  const checkIfFavorite = async () => {
    if (!user || !sessionId) return;

    const { data, error } = await supabase
      .from('favorite_workouts')
      .select('id')
      .eq('user_id', user.id)
      .eq('session_id', sessionId)
      .single();

    if (error) {
      console.error('Error checking favorite status:', error);
      return;
    }

    setIsFavorite(!!data);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des favoris",
        variant: "destructive",
      });
      return;
    }

    if (!sessionId) {
      console.error('No session ID provided');
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
          description: "L'entraînement a été retiré de vos favoris",
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
          description: "L'entraînement a été ajouté à vos favoris",
        });
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className="relative p-4 cursor-pointer hover:shadow-md transition-shadow ml-auto w-full max-w-md"
      onClick={onSelect}
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {sessionId && (
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700/50 transition-colors"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      )}
    </Card>
  );
};