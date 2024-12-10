import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useExerciseTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showImageUpload, setShowImageUpload] = useState<string | null>(null);
  const [showVideoUpload, setShowVideoUpload] = useState<string | null>(null);
  const [publishFilter, setPublishFilter] = useState<boolean | null>(false);

  // Utilisation de useQuery pour la gestion du cache et des données
  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['exercises', publishFilter],
    queryFn: async () => {
      let query = supabase.from('unified_exercises').select('*');
      
      if (publishFilter !== null) {
        query = query.eq('is_published', publishFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching exercises:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les exercices",
          variant: "destructive",
        });
        return [];
      }

      return data || [];
    },
  });

  // Mise en place de la souscription en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('unified_exercises_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'unified_exercises'
        },
        (payload) => {
          console.log('Changement détecté:', payload);
          // Invalider le cache pour forcer un rafraîchissement des données
          queryClient.invalidateQueries({ queryKey: ['exercises'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
      
      setSelectedExercises([]);
    } catch (error) {
      console.error('Error deleting exercises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les exercices",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (exerciseId: string, name: string) => {
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

  const handleSelectAll = (checked: boolean) => {
    setSelectedExercises(checked ? exercises.map(e => e.id) : []);
  };

  return {
    exercises,
    isLoading,
    selectedExercises,
    showImageUpload,
    showVideoUpload,
    publishFilter,
    setShowImageUpload,
    setShowVideoUpload,
    setSelectedExercises,
    handleSelectAll,
    handleDelete,
    handlePublish,
    setPublishFilter,
  };
};