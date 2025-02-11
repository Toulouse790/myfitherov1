
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgressionService, UserProgression } from "@/services/progression-service";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function useUserProgression() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: progression,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-progression'],
    queryFn: () => ProgressionService.getUserProgression(),
    enabled: !!user,
  });

  const initializeMutation = useMutation({
    mutationFn: ProgressionService.initializeUserProgression,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progression'] });
      toast({
        title: "Progression initialisée",
        description: "Votre progression a été initialisée avec succès",
      });
    },
    onError: (error) => {
      console.error('Error initializing progression:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la progression",
        variant: "destructive",
      });
    },
  });

  const updateMultipliersMutation = useMutation({
    mutationFn: ({ 
      workoutMultiplier, 
      nutritionMultiplier, 
      sleepMultiplier 
    }: {
      workoutMultiplier?: number;
      nutritionMultiplier?: number;
      sleepMultiplier?: number;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");
      return ProgressionService.updateUserMultipliers(
        user.id,
        workoutMultiplier,
        nutritionMultiplier,
        sleepMultiplier
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progression'] });
    },
  });

  const levelProgress = progression 
    ? ProgressionService.calculateLevelProgress(
        progression.total_points,
        progression.next_level_threshold
      )
    : 0;

  return {
    progression,
    isLoading,
    error,
    levelProgress,
    initializeProgression: initializeMutation.mutate,
    updateMultipliers: updateMultipliersMutation.mutate,
    getRequiredPointsForLevel: ProgressionService.getRequiredPointsForLevel,
  };
}
