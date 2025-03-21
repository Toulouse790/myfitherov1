
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface WorkoutRecommendation {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    rest: number;
  }>;
  targetMuscleGroups: string[];
  calories: number;
}

export const useWorkoutRecommendations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ['workout-recommendations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('workout_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error("Error fetching workout recommendations:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user
  });

  const generateRecommendation = async (preferences: {
    goal: string;
    experience: string;
    duration: number;
    focusAreas: string[];
    equipment: string[];
  }) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour générer des recommandations d'entraînement",
        variant: "destructive",
      });
      return null;
    }

    setIsGenerating(true);

    try {
      // Appel à la fonction Edge pour générer un programme d'entraînement personnalisé
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ userPreferences: preferences })
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la génération: ${response.statusText}`);
      }

      const workout = await response.json();

      // Sauvegarder la recommandation dans la base de données
      const { data, error } = await supabase
        .from('workout_recommendations')
        .insert([{
          user_id: user.id,
          name: `Programme ${preferences.goal} - ${preferences.experience}`,
          difficulty: preferences.experience,
          duration: preferences.duration,
          exercises: workout.exercises,
          target_muscle_groups: preferences.focusAreas,
          calories_estimate: workout.calories_estimate || 0,
          workout_data: workout
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Actualiser les données
      refetch();
      
      toast({
        title: "Programme généré avec succès",
        description: "Votre programme d'entraînement personnalisé est prêt",
      });
      
      return data;
    } catch (error) {
      console.error("Erreur lors de la génération du programme:", error);
      
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer un programme d'entraînement. Veuillez réessayer.",
        variant: "destructive",
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    recommendations,
    isLoading,
    isGenerating,
    generateRecommendation,
    refetch
  };
};
