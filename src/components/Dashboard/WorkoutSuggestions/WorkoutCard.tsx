import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface WorkoutCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  sessionId?: string;
}

export const WorkoutCard = ({ title, description, icon, onClick, sessionId }: WorkoutCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier si l'entraînement est déjà en favori
    const checkFavoriteStatus = async () => {
      if (!sessionId || !user) return;

      try {
        const { data, error } = await supabase
          .from('favorite_workouts')
          .select('id')
          .eq('session_id', sessionId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setIsFavorite(!!data);
      } catch (error) {
        console.error('Erreur lors de la vérification des favoris:', error);
      }
    };

    checkFavoriteStatus();
  }, [sessionId, user]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour ajouter des favoris",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorite_workouts')
          .delete()
          .eq('session_id', sessionId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        toast({
          title: "Retiré des favoris",
          description: "L'entraînement a été retiré de vos favoris",
        });
        
        setIsFavorite(false);
      } else {
        const { error } = await supabase
          .from('favorite_workouts')
          .insert([{ 
            session_id: sessionId,
            user_id: user.id
          }]);

        if (error) throw error;
        
        toast({
          title: "Ajouté aux favoris",
          description: "L'entraînement a été ajouté à vos favoris",
        });
        
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la gestion des favoris",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = () => {
    navigate('/workouts/generate');
  };

  return (
    <Card 
      className="bg-[#2A2F3F] p-3 cursor-pointer hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] relative"
      onClick={handleCardClick}
    >
      <div className="space-y-2">
        <div className="rounded-full bg-[#1E2330] w-8 h-8 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-white font-medium text-sm sm:text-base">{title}</h3>
        <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{description}</p>
      </div>
      
      {sessionId && (
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700/50 transition-colors"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      )}
    </Card>
  );
};