import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface WorkoutTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  exercise_data: any[];
  is_public: boolean;
}

export const useWorkoutTemplates = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['workout-templates', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workout_templates')
        .select('*')
        .or(`user_id.eq.${user?.id},is_public.eq.true`);

      if (error) {
        console.error('Error fetching templates:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user
  });

  const saveTemplate = useMutation({
    mutationFn: async (template: Partial<WorkoutTemplate>) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('workout_templates')
        .insert([{
          user_id: user.id,
          ...template
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-templates', user?.id] });
      toast({
        title: "Template sauvegardé",
        description: "Votre template d'entraînement a été enregistré avec succès.",
      });
    },
    onError: (error) => {
      console.error('Error saving template:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le template.",
        variant: "destructive",
      });
    }
  });

  return {
    templates,
    isLoading,
    saveTemplate: saveTemplate.mutate
  };
};