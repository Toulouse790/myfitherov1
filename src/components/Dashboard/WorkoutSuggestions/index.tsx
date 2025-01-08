import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SuggestionsList } from "./SuggestionsList";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface WorkoutSuggestionsProps {
  showAllSuggestions?: boolean;
}

export const WorkoutSuggestions = ({ showAllSuggestions = false }: WorkoutSuggestionsProps) => {
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

      navigate('/workouts');
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance",
        variant: "destructive",
      });
    }
  };

  const allSuggestions = [...defaultSuggestions, ...suggestions];
  const displayedSuggestions = showAllSuggestions ? allSuggestions : allSuggestions.slice(0, 4);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Suggestions</h2>
        {!showAllSuggestions && (
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => navigate('/suggestions')}
          >
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
      <SuggestionsList 
        suggestions={displayedSuggestions} 
        onSuggestionClick={handleSuggestionClick} 
      />
    </div>
  );
};