
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ObjectiveSelect } from "./Training/ObjectiveSelect";
import { ActivityLevelSelect } from "./Training/ActivityLevelSelect";
import { NotificationPreferences } from "./Training/NotificationPreferences";
import { EquipmentSelect } from "./Training/EquipmentSelect";

export const TrainingPreferences = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
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
      .single();

    if (error) {
      toast({
        title: t("common.error"),
        description: t("profile.training.errors.load"),
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
        title: t("common.error"),
        description: t("profile.training.errors.update"),
        variant: "destructive",
      });
      return;
    }

    setQuestionnaire(prev => prev ? { ...prev, [field]: value } : null);
    toast({
      title: t("common.success"),
      description: t("profile.training.success.update"),
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
        title: t("common.error"),
        description: t("profile.training.errors.reminder"),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t("common.success"),
      description: t("profile.training.success.reminder"),
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
