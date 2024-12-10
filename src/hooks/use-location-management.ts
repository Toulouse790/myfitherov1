import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLocationManagement = (exerciseId: string, initialLocations: string[] = []) => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>(initialLocations);
  const { toast } = useToast();

  const handleLocationChange = async (location: string) => {
    console.log('Changing location:', {
      exerciseId,
      location,
      currentLocations: selectedLocations
    });

    const newLocations = selectedLocations.includes(location)
      ? selectedLocations.filter(l => l !== location)
      : [...selectedLocations, location];

    console.log('New locations array:', newLocations);

    try {
      const { data, error } = await supabase
        .from('exercises')
        .update({ location: newLocations })
        .eq('id', exerciseId)
        .select();

      if (error) {
        console.error('Error updating location:', error);
        throw error;
      }

      console.log('Update successful:', data);
      setSelectedLocations(newLocations);
      
      toast({
        title: "Succès",
        description: "Lieux d'entraînement mis à jour",
      });
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les lieux d'entraînement",
        variant: "destructive",
      });
    }
  };

  return {
    selectedLocations,
    handleLocationChange
  };
};