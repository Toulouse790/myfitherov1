import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "@/hooks/use-translations";

interface ActivityLevelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ActivityLevelSelect = ({ value, onChange }: ActivityLevelSelectProps) => {
  const { t } = useTranslations();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("profile.training.level.label")}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("profile.training.level.label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sedentary">{t("profile.training.level.sedentary")}</SelectItem>
          <SelectItem value="lightly_active">{t("profile.training.level.lightly_active")}</SelectItem>
          <SelectItem value="moderately_active">{t("profile.training.level.moderately_active")}</SelectItem>
          <SelectItem value="very_active">{t("profile.training.level.very_active")}</SelectItem>
          <SelectItem value="extra_active">{t("profile.training.level.extra_active")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};