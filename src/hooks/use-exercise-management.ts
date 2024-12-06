import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useExerciseManagement = (onExercisesDeleted: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePublish = async (selectedExercises: string[]) => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Aucun exercice sélectionné",
        description: "Veuillez sélectionner au moins un exercice à publier",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Publishing exercises:', selectedExercises);
      
      const { error } = await supabase
        .from('exercises')
        .update({ is_published: true })
        .in('id', selectedExercises);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['exercises'] });

      toast({
        title: "Publication réussie",
        description: `${selectedExercises.length} exercice(s) publié(s) avec succès`,
      });

      onExercisesDeleted();
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la publication",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (selectedExercises: string[]) => {
    if (selectedExercises.length === 0) {
      toast({
        title: "Aucun exercice sélectionné",
        description: "Veuillez sélectionner au moins un exercice à supprimer",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error: mediaError } = await supabase
        .from('exercise_media')
        .delete()
        .in('exercise_id', selectedExercises);

      if (mediaError) throw mediaError;

      const { error: exerciseError } = await supabase
        .from('exercises')
        .delete()
        .in('id', selectedExercises);

      if (exerciseError) throw exerciseError;

      await queryClient.invalidateQueries({ queryKey: ['exercises'] });

      toast({
        title: "Suppression réussie",
        description: `${selectedExercises.length} exercice(s) supprimé(s) avec succès`,
      });

      onExercisesDeleted();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    toast({
      title: "Export en cours",
      description: "Les données sont en cours d'exportation...",
    });
  };

  return {
    handlePublish,
    handleDelete,
    handleExport,
  };
};