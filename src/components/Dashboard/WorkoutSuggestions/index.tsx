
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorkoutCard } from "./WorkoutCard";
import { GenerateWorkoutDialog } from "./GenerateWorkoutDialog";
import { useState, useEffect } from "react";
import { WorkoutSuggestion, WorkoutSuggestionsProps } from "./types";
import { defaultSuggestions } from "./defaultSuggestions";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/LanguageContext";
import { databaseSuggestions } from "./databaseSuggestions";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

export const WorkoutSuggestions = ({ showAllSuggestions = true }: WorkoutSuggestionsProps) => {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [localSuggestions, setLocalSuggestions] = useState<WorkoutSuggestion[]>([]);
  const navigate = useNavigate();

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
          title: t("common.error"),
          description: t("workouts.generationErrorDescription"),
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
    // Si nous avons des suggestions de la base de données, utilisez-les, sinon utilisez les suggestions par défaut
    let combinedSuggestions: WorkoutSuggestion[] = [];
    
    if (dbSuggestions && dbSuggestions.length > 0) {
      combinedSuggestions = [...dbSuggestions];
    } else if (databaseSuggestions && databaseSuggestions.length > 0) {
      // Utiliser les suggestions de la base de données locale si l'API échoue
      combinedSuggestions = [...databaseSuggestions];
    } else {
      // Fallback vers les suggestions par défaut
      combinedSuggestions = [...defaultSuggestions];
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
    
    // Limiter le nombre de suggestions "quick" pour éviter de trop afficher cette option
    const quickSuggestions = combinedSuggestions.filter(s => s.type === 'quick');
    if (quickSuggestions.length > 1) {
      const quickIndex = combinedSuggestions.findIndex(s => s.type === 'quick');
      if (quickIndex !== -1) {
        combinedSuggestions.splice(quickIndex, 1);
      }
    }
    
    setLocalSuggestions(combinedSuggestions);
  }, [dbSuggestions, workoutHistory]);

  const handleSelectWorkout = (type: string) => {
    setSelectedType(type);
    setIsGenerateOpen(true);
  };

  const handleNavigateToSportsPrograms = () => {
    navigate('/workouts');
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
      <h2 className="text-xl font-semibold mb-3">{t("workouts.startWorkout")}</h2>
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
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">{t('workouts.sportPrograms')}</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleNavigateToSportsPrograms}
          >
            <Users size={16} />
            {t('workouts.teamSports')}
          </Button>
        </div>
        <div className="border rounded-md p-4 bg-muted/10">
          <p className="text-sm text-muted-foreground mb-3">
            {t('workouts.sportSpecificDescription') || "Entraînements adaptés à votre sport et votre position"}
          </p>
          <Button 
            variant="default" 
            className="w-full"
            onClick={handleNavigateToSportsPrograms}
          >
            {t('common.view') || "Voir"}
          </Button>
        </div>
      </div>
      
      <GenerateWorkoutDialog
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        workoutType={selectedType}
      />
    </div>
  );
};
