import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Exercise {
  id: string;
  name: string;
  difficulty: string[];
  location: string[];
  is_published: boolean;
  image_url?: string;
  video_url?: string;
}

export const useExerciseTable = () => {
  const { toast } = useToast();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showImageUpload, setShowImageUpload] = useState<string | null>(null);
  const [showVideoUpload, setShowVideoUpload] = useState<string | null>(null);
  const [publishFilter, setPublishFilter] = useState<boolean | null>(false);

  const fetchExercises = async () => {
    try {
      setIsLoading(true);
      let query = supabase.from('unified_exercises').select('*');
      
      if (publishFilter !== null) {
        query = query.eq('is_published', publishFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setExercises(data || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les exercices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [publishFilter]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedExercises(checked ? exercises.map(e => e.id) : []);
  };

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
      fetchExercises();
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
      
      fetchExercises();
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