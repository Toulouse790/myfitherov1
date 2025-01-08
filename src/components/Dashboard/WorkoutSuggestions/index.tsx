import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SuggestionsList } from "./SuggestionsList";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { defaultSuggestions } from "./defaultSuggestions";
import { useWorkoutSession } from "./useWorkoutSession";
import type { WorkoutSuggestionsProps } from "./types";

export const WorkoutSuggestions = ({ showAllSuggestions = false }: WorkoutSuggestionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createWorkoutSession } = useWorkoutSession();

  const { data: dbSuggestions = [] } = useQuery({
    queryKey: ['workout-suggestions'],
    queryFn: async () => {
      console.log("Fetching workout suggestions from database");
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

      console.log("Fetched suggestions:", data);
      return data || [];
    }
  });

  // Filter out any database suggestions that have the same type as default suggestions
  const filteredDbSuggestions = dbSuggestions.filter(
    dbSuggestion => !defaultSuggestions.some(
      defaultSuggestion => defaultSuggestion.type === dbSuggestion.type
    )
  );

  // Combine filtered suggestions
  const allSuggestions = [...defaultSuggestions, ...filteredDbSuggestions];
  
  // Only show first 4 suggestions on dashboard, show all on suggestions page
  const displayedSuggestions = showAllSuggestions 
    ? allSuggestions 
    : allSuggestions.slice(0, 4);

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
        onSuggestionClick={createWorkoutSession} 
      />
    </div>
  );
};