import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SuggestionsList } from "./SuggestionsList";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { defaultSuggestions } from "./defaultSuggestions";
import { databaseSuggestions } from "./databaseSuggestions";
import { useWorkoutSession } from "./useWorkoutSession";
import { useAuth } from "@/hooks/use-auth";
import type { WorkoutSuggestionsProps } from "./types";

export const WorkoutSuggestions = ({ showAllSuggestions = false }: WorkoutSuggestionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { createWorkoutSession } = useWorkoutSession();

  const { data: dbSuggestions = [], isError, isLoading } = useQuery({
    queryKey: ['workout-suggestions'],
    queryFn: async () => {
      try {
        console.log("Fetching workout suggestions from database");
        const { data, error } = await supabase
          .from('workout_suggestions')
          .select('*')
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching suggestions:', error);
          throw error;
        }

        console.log("Fetched suggestions:", data);
        return data || [];
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      errorMessage: "Impossible de charger les suggestions. Veuillez réessayer."
    },
    onSettled: (data, error) => {
      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les suggestions. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    }
  });

  const handleSuggestionClick = async (type: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour accéder à cette fonctionnalité",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    
    await createWorkoutSession(type);
  };

  // Combine all suggestions
  const allSuggestions = [...defaultSuggestions, ...databaseSuggestions];
  
  // Only show first 4 suggestions on dashboard, show all on suggestions page
  const displayedSuggestions = showAllSuggestions 
    ? allSuggestions 
    : allSuggestions.slice(0, 4);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showAllSuggestions && (
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            className="gap-2 ml-auto"
            onClick={() => navigate('/suggestions')}
          >
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
      <SuggestionsList 
        suggestions={displayedSuggestions} 
        onSuggestionClick={handleSuggestionClick} 
      />
    </div>
  );
};