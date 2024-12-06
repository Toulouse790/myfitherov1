import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/hooks/use-translations";
import { ObjectiveSelect } from "./ObjectiveSelect";
import { ActivityLevelSelect } from "./ActivityLevelSelect";
import { NotificationPreferences } from "./NotificationPreferences";
import { EquipmentSelect } from "./EquipmentSelect";

export const TrainingPreferences = () => {
  const { toast } = useToast();
  const { t } = useTranslations();
  const [notifications, setNotifications] = useState(true);
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
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching questionnaire responses:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos préférences d'entraînement",
        variant: "destructive",
      });
      return;
    }

    if (data && data.length > 0) {
      setQuestionnaire(data[0]);
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

  if (!questionnaire) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">{t("profile.training.title")}</h2>
        <div className="space-y-6">
          <ObjectiveSelect
            value={questionnaire.objective}
            onChange={(value) => updateQuestionnaireResponse("objective", value)}
          />

          <Separator />

          <ActivityLevelSelect
            value={questionnaire.experience_level}
            onChange={(value) => updateQuestionnaireResponse("experience_level", value)}
          />

          <Separator />

          <EquipmentSelect
            value={questionnaire.available_equipment}
            onChange={(value) => updateQuestionnaireResponse("available_equipment", value)}
          />

          <Separator />

          <NotificationPreferences
            notifications={notifications}
            reminderTime={reminderTime}
            onNotificationsChange={setNotifications}
            onReminderTimeChange={handleReminderTimeChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};