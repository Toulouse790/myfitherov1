
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sport, SportPosition } from "@/utils/api/sportProgramsApi";

interface SportProgramFiltersProps {
  sports: Sport[];
  positions: SportPosition[];
  selectedSport: string;
  selectedPosition: string;
  setSelectedSport: (sportId: string) => void;
  setSelectedPosition: (positionId: string) => void;
  isLoading: boolean;
}

export const SportProgramFilters = ({
  sports,
  positions,
  selectedSport,
  selectedPosition,
  setSelectedSport,
  setSelectedPosition,
  isLoading
}: SportProgramFiltersProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t("sports.selectSport")}</label>
        <Select value={selectedSport} onValueChange={setSelectedSport}>
          <SelectTrigger>
            <SelectValue placeholder={t("sports.selectSport")} />
          </SelectTrigger>
          <SelectContent>
            {sports.map(sport => (
              <SelectItem key={sport.id} value={sport.id}>
                {sport.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">{t("positions.selectPosition")}</label>
        <Select value={selectedPosition} onValueChange={setSelectedPosition} disabled={positions.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder={positions.length === 0 ? t("positions.noPositionsAvailable") : t("positions.selectPosition")} />
          </SelectTrigger>
          <SelectContent>
            {positions.map(position => (
              <SelectItem key={position.id} value={position.id}>
                {position.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {positions.length === 0 && selectedSport && !isLoading && (
          <p className="text-xs text-muted-foreground mt-1">
            {t("positions.noPositionsAvailable")}
          </p>
        )}
      </div>
    </div>
  );
};
