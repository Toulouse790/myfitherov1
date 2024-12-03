import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrainingPreferencesProps {
  notifications: boolean;
  onNotificationsChange: (checked: boolean) => void;
}

export const TrainingPreferences = ({ notifications, onNotificationsChange }: TrainingPreferencesProps) => {
  const { toast } = useToast();
  const [reminderTime, setReminderTime] = useState<string>("30");
  const [questionnaire, setQuestionnaire] = useState<{
    objective: string;
    training_frequency: string;
    experience_level: string;
    available_equipment: string;
  } | null>(null);

  useEffect(() => {
    fetchQuestionnaireResponses();
  }, []);

  const fetchQuestionnaireResponses = async () => {
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
        description: "Impossible de charger vos préférences d'entraînement",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setQuestionnaire(data);
    }
  };

  const updateQuestionnaireResponse = async (field: string, value: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('questionnaire_responses')
      .update({ [field]: value })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos préférences",
        variant: "destructive",
      });
      return;
    }

    setQuestionnaire(prev => prev ? { ...prev, [field]: value } : null);
    toast({
      title: "Succès",
      description: "Vos préférences ont été mises à jour",
    });
  };

  const handleReminderTimeChange = async (value: string) => {
    setReminderTime(value);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ reminder_time: value })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le délai de rappel",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Succès",
      description: "Le délai de rappel a été mis à jour",
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Préférences d'entraînement</h2>
        <div className="space-y-4">
          {questionnaire && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Objectif principal</label>
                <Select
                  value={questionnaire.objective}
                  onValueChange={(value) => updateQuestionnaireResponse("objective", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre objectif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Perte de poids</SelectItem>
                    <SelectItem value="muscle_gain">Prise de masse musculaire</SelectItem>
                    <SelectItem value="maintenance">Maintien de la forme</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">Fréquence d'entraînement</label>
                <Select
                  value={questionnaire.training_frequency}
                  onValueChange={(value) => updateQuestionnaireResponse("training_frequency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6].map((days) => (
                      <SelectItem key={days} value={days.toString()}>
                        {days} jours par semaine
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau d'activité</label>
                <Select
                  value={questionnaire.experience_level}
                  onValueChange={(value) => updateQuestionnaireResponse("experience_level", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sédentaire</SelectItem>
                    <SelectItem value="lightly_active">Légèrement actif</SelectItem>
                    <SelectItem value="moderately_active">Modérément actif</SelectItem>
                    <SelectItem value="very_active">Très actif</SelectItem>
                    <SelectItem value="extra_active">Extrêmement actif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <label className="text-sm font-medium">Équipement disponible</label>
                <Select
                  value={questionnaire.available_equipment}
                  onValueChange={(value) => updateQuestionnaireResponse("available_equipment", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre équipement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">À la maison</SelectItem>
                    <SelectItem value="gym">En salle de sport</SelectItem>
                    <SelectItem value="outdoor">En extérieur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">Rappels d'entraînement</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={onNotificationsChange}
              />
            </div>
            
            {notifications && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Délai de rappel</label>
                <Select
                  value={reminderTime}
                  onValueChange={handleReminderTimeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le délai" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes avant</SelectItem>
                    <SelectItem value="60">1 heure avant</SelectItem>
                    <SelectItem value="120">2 heures avant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};