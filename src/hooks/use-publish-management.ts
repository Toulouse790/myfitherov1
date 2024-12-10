import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePublishManagement = (exerciseId: string, initialPublishState: boolean, onUpdate: () => void) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      const { error } = await supabase
        .from('exercises')
        .update({ is_published: !initialPublishState })
        .eq('id', exerciseId);

      if (error) throw error;

      onUpdate();
      toast({
        title: "Succès",
        description: initialPublishState 
          ? "Exercice retiré de la publication" 
          : "Exercice publié avec succès",
      });
    } catch (error) {
      console.error('Error toggling publish status:', error);
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
    handlePublishToggle
  };
};