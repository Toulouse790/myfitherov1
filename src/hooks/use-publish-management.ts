import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePublishManagement = (
  exerciseId: string,
  initialIsPublished: boolean,
  onUpdate: () => void
) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const handlePublishToggle = async () => {
    try {
      setIsPublishing(true);
      const { error } = await supabase
        .from('unified_exercises')
        .update({ is_published: !initialIsPublished })
        .eq('id', exerciseId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: !initialIsPublished 
          ? "L'exercice a été publié" 
          : "L'exercice a été dépublié",
      });

      onUpdate();
    } catch (error) {
      console.error('Error toggling exercise publish status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de publication",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    isPublishing,
    handlePublishToggle,
  };
};