
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Heart, Clock, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

interface WorkoutCardProps {
  title: string;
  description: string;
  sessionId?: string;
  duration?: number | null;
  difficulty?: string | null;
  muscleGroups?: string[];
  onSelect?: () => void;
}

export const WorkoutCard = ({ 
  title, 
  description, 
  sessionId,
  duration,
  difficulty,
  muscleGroups,
  onSelect 
}: WorkoutCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [lastUsed, setLastUsed] = useState<Date | null>(null);

  useEffect(() => {
    if (user && sessionId) {
      checkIfFavorite();
      getLastUsed();
    }
  }, [user, sessionId]);

  const checkIfFavorite = async () => {
    if (!user || !sessionId) return;

    try {
      const { data, error } = await supabase
        .from('favorite_workouts')
        .select('id')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) throw error;
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const getLastUsed = async () => {
    if (!user || !sessionId) return;

    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('created_at')
        .eq('user_id', user.id)
        .eq('template_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      if (data) {
        setLastUsed(new Date(data.created_at));
      }
    } catch (error) {
      console.error('Error fetching last used date:', error);
    }
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
      // Vérifier d'abord si la session existe
      const { data: sessionExists, error: sessionError } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('id', sessionId)
        .maybeSingle();

      if (sessionError) throw sessionError;

      if (!sessionExists) {
        toast({
          title: "Erreur",
          description: "Cette séance d'entraînement n'existe plus",
          variant: "destructive",
        });
        return;
      }

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
        description: "Une erreur est survenue lors de la modification des favoris",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (diff: string | null) => {
    if (!diff) return "bg-slate-200 text-slate-700";
    
    switch(diff) {
      case "beginner":
      case "easy":
        return "bg-green-100 text-green-800";
      case "moderate":
      case "adaptive":
        return "bg-blue-100 text-blue-800";
      case "challenging":
      case "advanced":
        return "bg-orange-100 text-orange-800";
      case "intense":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-200 text-slate-700";
    }
  };

  const formatLastUsed = () => {
    if (!lastUsed) return null;
    
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`;
    return `Il y a plus d'un mois`;
  };

  return (
    <Card 
      className="relative p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-semibold">{title}</h3>
            {lastUsed && (
              <span className="text-xs text-muted-foreground">({formatLastUsed()})</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground whitespace-normal">{description}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {duration && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                {duration} min
              </Badge>
            )}
            
            {difficulty && (
              <Badge variant="outline" className={`${getDifficultyColor(difficulty)} text-xs border-0`}>
                <BarChart3 className="h-3 w-3 mr-1" />
                {difficulty}
              </Badge>
            )}
            
            {muscleGroups && muscleGroups.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {muscleGroups.slice(0, 2).join(', ')}
                {muscleGroups.length > 2 && '...'}
              </Badge>
            )}
          </div>
        </div>

        {sessionId && (
          <button
            onClick={toggleFavorite}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart 
              className={`h-5 w-5 transition-colors ${
                isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'
              }`}
            />
          </button>
        )}
      </div>
    </Card>
  );
};
