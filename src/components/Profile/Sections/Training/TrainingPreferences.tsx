import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ObjectiveSection } from "./components/ObjectiveSection";
import { LocationSection } from "./components/LocationSection";
import { ExperienceSection } from "./components/ExperienceSection";

interface Preferences {
  objective: string;
  available_equipment: string;
  experience_level: string;
  training_frequency: string;
}

export const TrainingPreferences = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<Preferences>({
    objective: "",
    available_equipment: "",
    experience_level: "",
    training_frequency: ""
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour accéder à vos préférences",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Fetching preferences for user:", user.id);
      
      const { data, error } = await supabase
        .from('questionnaire_responses')
        .select('objective, available_equipment, experience_level, training_frequency')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching preferences:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos préférences",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        console.log("Fetched preferences:", data);
        setPreferences({
          objective: data.objective || "",
          available_equipment: data.available_equipment || "",
          experience_level: data.experience_level || "",
          training_frequency: data.training_frequency || ""
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = async (field: string, value: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setPreferences(prev => ({ ...prev, [field]: value }));
    
    try {
      const { error } = await supabase
        .from('questionnaire_responses')
        .update({ [field]: value })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour les préférences",
          variant: "destructive",
        });
        console.error('Error updating preferences:', error);
      } else {
        toast({
          title: "Succès",
          description: "Préférences mises à jour",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  // Create wrapped update functions for each field
  const handleObjectiveChange = (value: string) => handlePreferenceChange('objective', value);
  const handleLocationChange = (value: string) => handlePreferenceChange('available_equipment', value);
  const handleExperienceChange = (value: string) => handlePreferenceChange('experience_level', value);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-accent"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Préférences d'entraînement</h1>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        <Card className="p-6 space-y-8">
          <ObjectiveSection 
            value={preferences.objective}
            onChange={handleObjectiveChange}
          />
          <LocationSection 
            value={preferences.available_equipment}
            onChange={handleLocationChange}
          />
          <ExperienceSection 
            value={preferences.experience_level}
            onChange={handleExperienceChange}
          />
        </Card>
      </div>
    </div>
  );
};