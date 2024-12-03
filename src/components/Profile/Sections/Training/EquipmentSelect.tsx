import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslations } from "@/hooks/use-translations";

interface EquipmentSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const EquipmentSelect = ({ value, onChange }: EquipmentSelectProps) => {
  const { t } = useTranslations();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{t("profile.training.equipment.label")}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={t("profile.training.equipment.label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="home">{t("profile.training.equipment.home")}</SelectItem>
          <SelectItem value="gym">{t("profile.training.equipment.gym")}</SelectItem>
          <SelectItem value="outdoor">{t("profile.training.equipment.outdoor")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};