import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useLocationManagement = (
  exerciseId: string,
  initialLocations: string[]
) => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>(initialLocations);
  const { toast } = useToast();

  const handleLocationChange = async (location: string, checked: boolean) => {
    try {
      const newLocations = checked
        ? [...selectedLocations, location]
        : selectedLocations.filter(l => l !== location);

      const { error } = await supabase
        .from('unified_exercises')
        .update({ location: newLocations })
        .eq('id', exerciseId);

      if (error) throw error;

      setSelectedLocations(newLocations);
    } catch (error) {
      console.error('Error updating exercise location:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le lieu",
        variant: "destructive",
      });
    }
  };

  return {
    selectedLocations,
    handleLocationChange,
  };
};