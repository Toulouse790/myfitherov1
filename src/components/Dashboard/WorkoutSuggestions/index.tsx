import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkoutCard } from "./WorkoutCard";
import { GenerateWorkoutDialog } from "./GenerateWorkoutDialog";
import { useState } from "react";

interface WorkoutSuggestionsProps {
  showAllSuggestions?: boolean;
}

export const WorkoutSuggestions = ({ showAllSuggestions = true }: WorkoutSuggestionsProps) => {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const { toast } = useToast();

  console.log("Fetching workout suggestions from database");

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['workout-suggestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workout_suggestions')
        .select('*')
        .eq('is_active', true)
        .order('suggested_order', { ascending: true });

      if (error) {
        throw error;
      }

      console.log("Fetched suggestions:", data);
      return data || [];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    meta: {
      errorMessage: "Impossible de charger les suggestions. Veuillez réessayer."
    },
    onError: (error) => {
      console.error('Error fetching suggestions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les suggestions. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
        <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  const displayedSuggestions = showAllSuggestions 
    ? suggestions 
    : suggestions.slice(0, 3);

  return (
    <div className="space-y-4">
      {displayedSuggestions.map((suggestion) => (
        <WorkoutCard
          key={suggestion.id}
          suggestion={suggestion}
          onGenerateClick={() => setIsGenerateOpen(true)}
        />
      ))}
      
      <GenerateWorkoutDialog
        open={isGenerateOpen}
        onOpenChange={setIsGenerateOpen}
      />
    </div>
  );
};