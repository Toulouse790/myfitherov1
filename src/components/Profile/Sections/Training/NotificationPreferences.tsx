import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";

interface NotificationPreferencesProps {
  notifications: boolean;
  reminderTime: string;
  onNotificationsChange: (checked: boolean) => void;
  onReminderTimeChange: (value: string) => void;
}

export const NotificationPreferences = ({
  notifications,
  reminderTime,
  onNotificationsChange,
  onReminderTimeChange,
}: NotificationPreferencesProps) => {
  const { t } = useTranslations();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5" />
          <div>
            <p className="font-medium">{t("profile.training.notifications.label")}</p>
            <p className="text-sm text-muted-foreground">
              {t("profile.training.notifications.description")}
            </p>
          </div>
        </div>
        <Switch checked={notifications} onCheckedChange={onNotificationsChange} />
      </div>

      {notifications && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("profile.training.notifications.reminder.label")}
          </label>
          <Select value={reminderTime} onValueChange={onReminderTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("profile.training.notifications.reminder.label")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">{t("profile.training.notifications.reminder.30")}</SelectItem>
              <SelectItem value="60">{t("profile.training.notifications.reminder.60")}</SelectItem>
              <SelectItem value="120">{t("profile.training.notifications.reminder.120")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};