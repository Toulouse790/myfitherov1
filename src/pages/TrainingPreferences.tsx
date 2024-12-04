import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/Layout/BottomNav";
import { ObjectiveSelect } from "@/components/Profile/Sections/Training/ObjectiveSelect";
import { ActivityLevelSelect } from "@/components/Profile/Sections/Training/ActivityLevelSelect";
import { EquipmentSelect } from "@/components/Profile/Sections/Training/EquipmentSelect";
import { MeasurementsSection } from "@/components/Profile/Sections/MeasurementsSection";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const TrainingPreferencesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    objective: "",
    experience_level: "",
    available_equipment: "",
  });
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos préférences",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setPreferences({
        objective: data.objective || "",
        experience_level: data.experience_level || "",
        available_equipment: data.available_equipment || "",
      });
    }
    setLoading(false);
  };

  const handlePreferenceChange = (field: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const savePreferences = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('questionnaire_responses')
      .update(preferences)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos préférences",
        variant: "destructive",
      });
      return;
    }

    setHasChanges(false);
    toast({
      title: "Succès",
      description: "Vos préférences ont été mises à jour",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="text-foreground hover:text-foreground/80"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <Button 
          onClick={savePreferences}
          disabled={!hasChanges}
        >
          Enregistrer
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-6">Préférences d'entraînement</h1>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Objectif principal</h2>
            <ObjectiveSelect
              value={preferences.objective}
              onChange={(value) => handlePreferenceChange("objective", value)}
            />
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Niveau d'activité</h2>
            <ActivityLevelSelect
              value={preferences.experience_level}
              onChange={(value) => handlePreferenceChange("experience_level", value)}
            />
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Équipement disponible</h2>
            <EquipmentSelect
              value={preferences.available_equipment}
              onChange={(value) => handlePreferenceChange("available_equipment", value)}
            />
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <MeasurementsSection />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default TrainingPreferencesPage;