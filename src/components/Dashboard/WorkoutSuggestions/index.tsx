import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkoutCard } from "./WorkoutCard";
import { GenerateWorkoutDialog } from "./GenerateWorkoutDialog";
import { useState } from "react";
import { WorkoutSuggestion, WorkoutSuggestionsProps } from "./types";
import { Dumbbell } from "lucide-react";

export const WorkoutSuggestions = ({ showAllSuggestions = true }: WorkoutSuggestionsProps) => {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const { toast } = useToast();

  console.log("Fetching workout suggestions from database");

  const { data: suggestions = [], isLoading, error } = useQuery({
    queryKey: ['workout-suggestions'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('workout_suggestions')
          .select('*')
          .eq('is_active', true)
          .order('suggested_order', { ascending: true });

        if (error) {
          console.error('Error fetching suggestions:', error);
          throw error;
        }

        // Supprimer les doublons en utilisant un Set basé sur l'ID
        const uniqueSuggestions = Array.from(
          new Map(data.map(item => [item.id, item])).values()
        );

        console.log("Fetched unique suggestions:", uniqueSuggestions);
        return uniqueSuggestions || [];
      } catch (error) {
        console.error('Error in workout suggestions query:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les suggestions. Veuillez réessayer.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
        <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Une erreur est survenue lors du chargement des suggestions
      </div>
    );
  }

  const displayedSuggestions = showAllSuggestions 
    ? suggestions 
    : suggestions.slice(0, 3);

  return (
    <div className="space-y-4">
      {displayedSuggestions.map((suggestion: WorkoutSuggestion) => (
        <WorkoutCard
          key={suggestion.id}
          title={suggestion.title}
          description={suggestion.description}
          icon={<Dumbbell className="w-5 h-5 text-primary" />}
          onClick={() => setIsGenerateOpen(true)}
          sessionId={suggestion.id}
        />
      ))}
      
      <GenerateWorkoutDialog
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
      />
    </div>
  );
};