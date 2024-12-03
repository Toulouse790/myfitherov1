import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "@/hooks/use-translations";

interface ObjectiveSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ObjectiveSelect = ({ value, onChange }: ObjectiveSelectProps) => {
  const { t } = useTranslations();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("profile.training.objective.label")}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("profile.training.objective.label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="weight_loss">{t("profile.training.objective.weight_loss")}</SelectItem>
          <SelectItem value="muscle_gain">{t("profile.training.objective.muscle_gain")}</SelectItem>
          <SelectItem value="maintenance">{t("profile.training.objective.maintenance")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};