
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sport, SportPosition } from "@/utils/api/sportProgramsApi";
import { Label } from "@/components/ui/label";

interface SportProgramFiltersProps {
  sports: Sport[];
  positions: SportPosition[];
  selectedSport: string;
  selectedPosition: string;
  selectedLevel: string;
  setSelectedSport: (sportId: string) => void;
  setSelectedPosition: (positionId: string) => void;
  setSelectedLevel: (level: string) => void;
  isLoading: boolean;
}

export const SportProgramFilters = ({ 
  sports, 
  positions, 
  selectedSport, 
  selectedPosition,
  selectedLevel,
  setSelectedSport, 
  setSelectedPosition,
  setSelectedLevel,
  isLoading 
}: SportProgramFiltersProps) => {
  const { t } = useLanguage();
  
  const levels = [
    { id: "all", name: t("programs.allLevels") },
    { id: "amateur", name: t("programs.levelAmateur") },
    { id: "semi-pro", name: t("programs.levelSemiPro") },
    { id: "pro", name: t("programs.levelPro") }
  ];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sport-select">{t("sports.selectSport")}</Label>
          <Select 
            value={selectedSport} 
            onValueChange={setSelectedSport}
            disabled={isLoading || sports.length === 0}
          >
            <SelectTrigger id="sport-select" className="w-full">
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
        
        {positions.length > 0 && (
          <div>
            <Label htmlFor="position-select">{t("positions.selectPosition")}</Label>
            <Select 
              value={selectedPosition} 
              onValueChange={setSelectedPosition}
              disabled={isLoading || positions.length === 0}
            >
              <SelectTrigger id="position-select" className="w-full">
                <SelectValue placeholder={t("positions.selectPosition")} />
              </SelectTrigger>
              <SelectContent>
                {positions.map(position => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="level-select">{t("programs.filterByLevel")}</Label>
          <Select 
            value={selectedLevel} 
            onValueChange={setSelectedLevel}
            disabled={isLoading}
          >
            <SelectTrigger id="level-select" className="w-full">
              <SelectValue placeholder={t("programs.filterByLevel")} />
            </SelectTrigger>
            <SelectContent>
              {levels.map(level => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
