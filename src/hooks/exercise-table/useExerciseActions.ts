import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useExerciseActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (exerciseIds: string[]) => {
    try {
      const { error } = await supabase
        .from('unified_exercises')
        .delete()
        .in('id', exerciseIds);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Exercices supprimés avec succès",
      });
      
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    } catch (error) {
      console.error('Error deleting exercises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les exercices",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (exerciseId: string, name: string, publishFilter: boolean | null) => {
    try {
      const newPublishState = !publishFilter;
      
      const { error } = await supabase
        .from('unified_exercises')
        .update({ 
          is_published: newPublishState,
          name: name 
        })
        .eq('id', exerciseId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['exercises'] });

      toast({
        title: "Succès",
        description: `Exercice ${newPublishState ? 'publié' : 'dépublié'}`,
      });
    } catch (error) {
      console.error('Error updating exercise:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'exercice",
        variant: "destructive",
      });
    }
  };

  return {
    handleDelete,
    handlePublish,
  };
};