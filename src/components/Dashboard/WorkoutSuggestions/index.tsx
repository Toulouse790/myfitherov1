
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkoutCard } from "./WorkoutCard";
import { GenerateWorkoutDialog } from "./GenerateWorkoutDialog";
import { useState, useEffect } from "react";
import { WorkoutSuggestion, WorkoutSuggestionsProps } from "./types";
import { defaultSuggestions } from "./defaultSuggestions";
import { useAuth } from "@/hooks/use-auth";

export const WorkoutSuggestions = ({ showAllSuggestions = true }: WorkoutSuggestionsProps) => {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const [localSuggestions, setLocalSuggestions] = useState<WorkoutSuggestion[]>([]);

  // Récupérer les suggestions depuis la base de données
  const { data: dbSuggestions = [], isLoading, error } = useQuery({
    queryKey: ['workout-suggestions'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('workout_suggestions')
          .select('*')
          .eq('is_active', true)
          .order('suggested_order', { ascending: true });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les suggestions. Utilisation des données locales.",
          variant: "destructive",
        });
        return [];
      }
    },
    retry: 1,
  });

  // Récupérer l'historique des entraînements pour personnaliser l'ordre des suggestions
  const { data: workoutHistory } = useQuery({
    queryKey: ['workout-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('workout_type, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching workout history:', error);
        return [];
      }
    },
    enabled: !!user,
  });

  // Mélanger et prioriser les suggestions en fonction de l'historique d'entraînement
  useEffect(() => {
    // Combiner les suggestions de la DB avec les locales, avec priorité à la DB
    const combinedSuggestions = [...dbSuggestions];
    
    // Ajouter des suggestions locales si la DB n'en fournit pas assez
    if (combinedSuggestions.length < 4) {
      // Filtrer les suggestions locales qui ne sont pas déjà dans la DB
      const dbIds = new Set(combinedSuggestions.map(s => s.id));
      const missingLocalSuggestions = defaultSuggestions.filter(s => !dbIds.has(s.id));
      
      // Ajouter les suggestions locales manquantes
      combinedSuggestions.push(...missingLocalSuggestions);
    }
    
    // Personnaliser l'ordre en fonction de l'historique d'entraînement
    if (workoutHistory && workoutHistory.length > 0) {
      // Identifier les types d'entraînement récemment utilisés
      const recentTypes = new Set(workoutHistory.slice(0, 3).map(w => w.workout_type));
      
      // Analyser les types que l'utilisateur n'a pas fait récemment
      const lastTrainingDate = new Map();
      workoutHistory.forEach(w => {
        if (!lastTrainingDate.has(w.workout_type)) {
          lastTrainingDate.set(w.workout_type, new Date(w.created_at));
        }
      });
      
      // Trier les suggestions pour varier l'entraînement
      combinedSuggestions.sort((a, b) => {
        // Obtenir le temps écoulé depuis le dernier entraînement de ce type
        const typeA = a.type;
        const typeB = b.type;
        
        const lastUsedA = lastTrainingDate.get(typeA);
        const lastUsedB = lastTrainingDate.get(typeB);
        
        // Si un type n'a jamais été utilisé, le prioriser
        if (!lastUsedA && lastUsedB) return -1;
        if (lastUsedA && !lastUsedB) return 1;
        if (!lastUsedA && !lastUsedB) return 0;
        
        // Prioriser les types les moins récemment utilisés
        return lastUsedA.getTime() - lastUsedB.getTime();
      });
    } else {
      // Si pas d'historique, mélanger aléatoirement pour varier
      for (let i = combinedSuggestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combinedSuggestions[i], combinedSuggestions[j]] = [combinedSuggestions[j], combinedSuggestions[i]];
      }
    }
    
    setLocalSuggestions(combinedSuggestions);
  }, [dbSuggestions, workoutHistory]);

  const handleSelectWorkout = (type: string) => {
    setSelectedType(type);
    setIsGenerateOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
        <div className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  const displayedSuggestions = showAllSuggestions 
    ? localSuggestions 
    : localSuggestions.slice(0, 3);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Suggestions d'entraînement</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayedSuggestions.map((suggestion: WorkoutSuggestion) => (
          <WorkoutCard
            key={suggestion.id}
            title={suggestion.title}
            description={suggestion.description}
            sessionId={String(suggestion.id)}
            duration={suggestion.duration}
            difficulty={suggestion.difficulty}
            muscleGroups={suggestion.muscleGroups}
            onSelect={() => handleSelectWorkout(suggestion.type)}
          />
        ))}
      </div>
      
      <GenerateWorkoutDialog
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        workoutType={selectedType}
      />
    </div>
  );
};
