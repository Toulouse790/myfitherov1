import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

export const TrainingPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    objective: "",
    available_equipment: "",
    experience_level: ""
  });

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .select('objective, available_equipment, experience_level')
          .eq('user_id', user.id)
          .maybeSingle();

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
          setPreferences({
            objective: data.objective || "",
            available_equipment: data.available_equipment || "",
            experience_level: data.experience_level || ""
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

    fetchPreferences();
  }, [user, toast]);

  const handlePreferenceChange = async (field: string, value: string) => {
    if (!user) return;
    
    setPreferences(prev => ({ ...prev, [field]: value }));
    
    try {
      const { error } = await supabase
        .from('questionnaire_responses')
        .upsert({
          user_id: user.id,
          [field]: value
        });

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
          {/* Objectif */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Objectif principal</h3>
            <RadioGroup 
              value={preferences.objective}
              onValueChange={(value) => handlePreferenceChange('objective', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weight_loss" id="weight_loss" />
                <Label htmlFor="weight_loss">Perte de poids</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="muscle_gain" id="muscle_gain" />
                <Label htmlFor="muscle_gain">Prise de masse</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maintenance" id="maintenance" />
                <Label htmlFor="maintenance">Maintien</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Lieu d'entraînement */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Lieu d'entraînement préféré</h3>
            <RadioGroup 
              value={preferences.available_equipment}
              onValueChange={(value) => handlePreferenceChange('available_equipment', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="home" id="home" />
                <Label htmlFor="home">À la maison</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gym" id="gym" />
                <Label htmlFor="gym">En salle de sport</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outdoor" id="outdoor" />
                <Label htmlFor="outdoor">En extérieur</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Niveau d'expérience */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Niveau d'expérience</h3>
            <RadioGroup 
              value={preferences.experience_level}
              onValueChange={(value) => handlePreferenceChange('experience_level', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner">Débutant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate">Intermédiaire</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">Avancé</Label>
              </div>
            </RadioGroup>
          </div>
        </Card>
      </div>
    </div>
  );
};