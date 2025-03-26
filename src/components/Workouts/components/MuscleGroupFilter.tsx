
import { muscleGroups } from "../workoutConstants";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface MuscleGroupFilterProps {
  selectedGroup: string;
  onGroupSelect: (group: string) => void;
}

export const MuscleGroupFilter = ({
  selectedGroup,
  onGroupSelect,
}: MuscleGroupFilterProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedGroup === "" ? "default" : "outline"}
        onClick={() => onGroupSelect("")}
        className="whitespace-nowrap"
      >
        {t("workouts.allMuscleGroups")}
      </Button>
      {muscleGroups.map((group) => (
        <Button
          key={group.id}
          variant={selectedGroup === group.name ? "default" : "outline"}
          onClick={() => onGroupSelect(group.name)}
          className="whitespace-nowrap"
        >
          {group.name}
        </Button>
      ))}
    </div>
  );
};
