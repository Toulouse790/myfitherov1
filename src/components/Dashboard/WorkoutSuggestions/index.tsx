import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SuggestionsList } from "./SuggestionsList";
import { Button } from "@/components/ui/button";
import { Plus, Play } from "lucide-react";

export const WorkoutSuggestions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: suggestions = [] } = useQuery({
    queryKey: ['workout-suggestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workout_suggestions')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching suggestions:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les suggestions",
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    }
  });

  const defaultSuggestions = [
    {
      id: 1,
      title: "Séance favorite",
      description: "Reprendre une séance sauvegardée",
      icon_name: "Bookmark",
      type: "favorites"
    },
    {
      id: 2,
      title: "Séance du jour",
      description: "Séance adaptée à vos objectifs",
      icon_name: "Target",
      type: "daily"
    },
    {
      id: 3,
      title: "Séance rapide",
      description: "20-30 minutes d'entraînement",
      icon_name: "Zap",
      type: "quick"
    },
    {
      id: 4,
      title: "Full body",
      description: "Entraînement complet du corps",
      icon_name: "Dumbbell",
      type: "full_body"
    }
  ];

  const handleSuggestionClick = async (type: string) => {
    try {
      if (type === 'favorites') {
        toast({
          title: "Bientôt disponible",
          description: "Cette fonctionnalité sera disponible prochainement",
        });
        return;
      }

      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert({
          type: 'strength',
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      if (session) {
        navigate(`/workout/${session.id}`);
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance",
        variant: "destructive",
      });
    }
  };

  const handleCreateSession = () => {
    navigate('/workouts/type');
  };

  const handleLetMeDoIt = () => {
    navigate('/workouts');
  };

  const allSuggestions = [...defaultSuggestions, ...suggestions];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Suggestions</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button 
          onClick={handleCreateSession}
          className="flex-1 gap-2"
          size="lg"
        >
          <Plus className="w-5 h-5" />
          Créer ma séance
        </Button>
        <Button 
          onClick={handleLetMeDoIt}
          variant="outline"
          className="flex-1 gap-2"
          size="lg"
        >
          <Play className="w-5 h-5" />
          Laisse-moi faire
        </Button>
      </div>
      
      <SuggestionsList 
        suggestions={allSuggestions} 
        onSuggestionClick={handleSuggestionClick} 
      />
    </div>
  );
};