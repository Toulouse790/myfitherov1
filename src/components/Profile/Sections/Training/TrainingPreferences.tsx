
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ObjectiveSelect } from "./ObjectiveSelect";
import { EquipmentSelect } from "./EquipmentSelect";
import { ActivityLevelSelect } from "./ActivityLevelSelect";
import { NotificationPreferences } from "./NotificationPreferences";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";

interface Preferences {
  objective: string;
  available_equipment: string;
  experience_level: string;
  training_frequency: string;
}

export const TrainingPreferences = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState("30");
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
        title: t("common.error"),
        description: t("profile.training.errors.load"),
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
          title: t("common.error"),
          description: t("profile.training.errors.load"),
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
        title: t("common.error"),
        description: t("profile.training.errors.load"),
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
          title: t("common.error"),
          description: t("profile.training.errors.update"),
          variant: "destructive",
        });
        console.error('Error updating preferences:', error);
      } else {
        toast({
          title: t("common.success"),
          description: t("profile.training.success.update"),
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: t("common.error"),
        description: t("profile.training.errors.update"),
        variant: "destructive",
      });
    }
  };

  // Create wrapped update functions for each field
  const handleObjectiveChange = (value: string) => handlePreferenceChange('objective', value);
  const handleLocationChange = (value: string) => handlePreferenceChange('available_equipment', value);
  const handleExperienceChange = (value: string) => handlePreferenceChange('experience_level', value);
  
  const handleReminderTimeChange = (value: string) => {
    setReminderTime(value);
    // Implementation of reminder time change logic
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
      <Card className="p-6 space-y-8">
        <h2 className="text-xl font-semibold">{t("profile.training.title")}</h2>
        
        <div className="space-y-6">
          <ObjectiveSelect 
            value={preferences.objective}
            onChange={handleObjectiveChange}
          />
          
          <Separator />
          
          <ActivityLevelSelect 
            value={preferences.experience_level}
            onChange={handleExperienceChange}
          />
          
          <Separator />
          
          <EquipmentSelect 
            value={preferences.available_equipment}
            onChange={handleLocationChange}
          />
          
          <Separator />
          
          <NotificationPreferences
            notifications={notifications}
            reminderTime={reminderTime}
            onNotificationsChange={setNotifications}
            onReminderTimeChange={handleReminderTimeChange}
          />
        </div>
      </Card>
    </div>
  );
};
